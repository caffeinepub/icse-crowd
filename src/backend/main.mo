import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  module Post {
    public func compare(p1 : Post, p2 : Post) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Report {
    public func compare(r1 : Report, r2 : Report) : Order.Order {
      Nat.compare(r1.id, r2.id);
    };
  };

  module UserProfile {
    public func compare(u1 : UserProfile, u2 : UserProfile) : Order.Order {
      Principal.compare(u1.principal, u2.principal);
    };
  };

  module FriendRequestKey {
    public func compare(lhs : (Principal, Principal), rhs : (Principal, Principal)) : Order.Order {
      switch (Principal.compare(lhs.0, rhs.0)) {
        case (#equal) { Principal.compare(lhs.1, rhs.1) };
        case (other) { other };
      };
    };
  };

  // Custom Types
  type UserRole = AccessControl.UserRole;

  public type UserProfile = {
    principal : Principal;
    name : Text;
    email : Text;
    academicDetails : Text;
    role : UserRole;
    blockedUsers : [Principal];
  };

  type FriendRequest = {
    from : Principal;
    to : Principal;
    timestamp : Time.Time;
  };

  type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    image : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
    document : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    likes : [Principal];
  };

  public type Comment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type ChatMessage = {
    id : Nat;
    from : Principal;
    to : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type StudyGroup = {
    id : Nat;
    name : Text;
    description : Text;
    members : [Principal];
    creator : Principal;
  };

  type SharedNote = {
    id : Nat;
    groupId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type ForumPost = {
    id : Nat;
    author : Principal;
    subject : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type Report = {
    id : Nat;
    reporter : Principal;
    reportedUser : ?Principal;
    reportedContent : ?Text;
    reason : Text;
    timestamp : Time.Time;
    status : { #pending; #reviewed; #resolved };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let friendRequests = Map.empty<(Principal, Principal), FriendRequest>();
  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();
  let chatMessages = Map.empty<Nat, ChatMessage>();
  let studyGroups = Map.empty<Nat, StudyGroup>();
  let sharedNotes = Map.empty<Nat, SharedNote>();
  let forumPosts = Map.empty<Nat, ForumPost>();
  let reports = Map.empty<Nat, Report>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Maximum video size: 600MB in bytes
  let MAX_VIDEO_SIZE_BYTES : Nat = 600 * 1024 * 1024;

  func generateUniqueId() : Nat {
    Time.now().toNat();
  };

  func principalEquals(a : Principal, b : Principal) : Bool {
    Principal.equal(a, b);
  };

  func validateVideoSize(video : ?Storage.ExternalBlob) : () {
    switch (video) {
      case (null) { /* No video, validation passes */ };
      case (?blob) {
        if (blob.size() > MAX_VIDEO_SIZE_BYTES) {
          Runtime.trap("Video upload rejected: File size exceeds the maximum allowed limit of 600MB. Please upload a smaller video file.");
        };
      };
    };
  };

  module FriendsList {
    public func compare(list1 : List.List<Principal>, list2 : List.List<Principal>) : Order.Order {
      let size1 = list1.size();
      let size2 = list2.size();
      switch (Nat.compare(size1, size2)) {
        case (#equal) {
          let iter1 = list1.toArray().values();
          let iter2 = list2.toArray().values();
          compareIterators(iter1, iter2);
        };
        case (order) { order };
      };
    };

    func compareIterators(iter1 : Iter.Iter<Principal>, iter2 : Iter.Iter<Principal>) : Order.Order {
      switch (iter1.next(), iter2.next()) {
        case (?p1, ?p2) {
          switch (Principal.compare(p1, p2)) {
            case (#equal) { compareIterators(iter1, iter2) };
            case (order) { order };
          };
        };
        case (null, ?_) { #less };
        case (?_, null) { #greater };
        case (null, null) { #equal };
      };
    };
  };

  public shared ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func createUserProfile(name : Text, email : Text, academicDetails : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };
    let newProfile : UserProfile = {
      principal = caller;
      name;
      email;
      academicDetails;
      role = #user;
      blockedUsers = [];
    };
    userProfiles.add(caller, newProfile);
  };

  func checkUserProfileExists(caller : Principal) : () {
    if (userProfiles.get(caller) == null) {
      Runtime.trap("User must have a profile to create posts and comments!");
    };
  };

  public shared ({ caller }) func sendFriendRequest(to : Principal) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send friend requests");
    };
    if (not userProfiles.containsKey(to)) {
      Runtime.trap("User not found");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.blockedUsers.values().any(func(b) { principalEquals(b, to) })) {
          Runtime.trap("User is blocked");
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
    switch (userProfiles.get(to)) {
      case (?profile) {
        if (profile.blockedUsers.values().any(func(b) { principalEquals(b, caller) })) {
          Runtime.trap("This user has blocked you. Your friend request cannot be sent.");
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
    let request : FriendRequest = {
      from = caller;
      to;
      timestamp = Time.now();
    };
    friendRequests.add((caller, to), request);
  };

  public shared ({ caller }) func acceptFriendRequest(from : Principal) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept friend requests");
    };
    switch (friendRequests.get((from, caller))) {
      case (null) { Runtime.trap("Friend request not found") };
      case (?request) {
        // Verify the request is actually for the caller
        if (request.to != caller) {
          Runtime.trap("Unauthorized: You can only accept friend requests sent to you");
        };
        friendRequests.remove((from, caller));
      };
    };
  };

  public shared ({ caller }) func createPost(content : Text, image : ?Storage.ExternalBlob, video : ?Storage.ExternalBlob, document : ?Storage.ExternalBlob) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    validateVideoSize(video);

    let id = generateUniqueId();
    let post : Post = {
      id;
      author = caller;
      content;
      image;
      video;
      document;
      timestamp = Time.now();
      likes = [];
    };

    posts.add(id, post);
  };

  public shared ({ caller }) func likePost(postId : Nat) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (not post.likes.values().any(func(l) { principalEquals(l, caller) })) {
          let updatedLikes = post.likes.concat([caller]);
          let updatedPost : Post = { post with likes = updatedLikes };
          posts.add(postId, updatedPost);
        };
      };
    };
  };

  public shared ({ caller }) func addComment(postId : Nat, content : Text) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    if (not posts.containsKey(postId)) {
      Runtime.trap("Post not found");
    };
    let id = generateUniqueId();
    let comment : Comment = {
      id;
      postId;
      author = caller;
      content;
      timestamp = Time.now();
    };
    comments.add(id, comment);
  };

  public shared ({ caller }) func getFeed() : async [Post] {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view feed");
    };
    posts.values().toArray().sort();
  };

  public shared ({ caller }) func sendMessage(to : Principal, content : Text) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    if (not userProfiles.containsKey(to)) {
      Runtime.trap("Recipient not found");
    };
    switch (userProfiles.get(to)) {
      case (?profile) {
        if (profile.blockedUsers.values().any(func(b) { principalEquals(b, caller) })) {
          Runtime.trap("Cannot send message: You are blocked by this user");
        };
      };
      case (null) { Runtime.trap("Recipient not found") };
    };
    let id = generateUniqueId();
    let message : ChatMessage = {
      id;
      from = caller;
      to;
      content;
      timestamp = Time.now();
    };
    chatMessages.add(id, message);
  };

  public shared ({ caller }) func createStudyGroup(name : Text, description : Text) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create study groups");
    };

    // Ensure the group name is not empty
    if (name.size() == 0) {
      Runtime.trap("Group name cannot be empty");
    };

    let id = generateUniqueId();
    let group : StudyGroup = {
      id;
      name;
      description;
      members = [caller];
      creator = caller;
    };
    studyGroups.add(id, group);
  };

  public shared ({ caller }) func addSharedNote(groupId : Nat, content : Text) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add shared notes");
    };
    switch (studyGroups.get(groupId)) {
      case (null) { Runtime.trap("Study group not found") };
      case (?group) {
        if (not group.members.values().any(func(m) { principalEquals(m, caller) })) {
          Runtime.trap("Unauthorized: You are not a member of this study group");
        };
      };
    };
    let id = generateUniqueId();
    let note : SharedNote = {
      id;
      groupId;
      author = caller;
      content;
      timestamp = Time.now();
    };
    sharedNotes.add(id, note);
  };

  public shared ({ caller }) func createForumPost(subject : Text, content : Text) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create forum posts");
    };
    let id = generateUniqueId();
    let post : ForumPost = {
      id;
      author = caller;
      subject;
      content;
      timestamp = Time.now();
    };
    forumPosts.add(id, post);
  };

  public shared ({ caller }) func reportContent(
    reportedUser : ?Principal,
    reportedContent : ?Text,
    reason : Text,
  ) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report content");
    };
    let id = generateUniqueId();
    let report : Report = {
      id;
      reporter = caller;
      reportedUser;
      reportedContent;
      reason;
      timestamp = Time.now();
      status = #pending;
    };
    reports.add(id, report);
  };

  public shared ({ caller }) func blockUser(user : Principal) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can block other users");
    };
    if (caller == user) {
      Runtime.trap("Cannot block yourself");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (not profile.blockedUsers.values().any(func(b) { principalEquals(b, user) })) {
          let updatedBlockedUsers = profile.blockedUsers.concat([user]);
          let updatedProfile : UserProfile = { profile with blockedUsers = updatedBlockedUsers };
          userProfiles.add(caller, updatedProfile);
        };
      };
    };
  };

  public shared ({ caller }) func getReports() : async [Report] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only moderators and admins can view reports");
    };
    reports.values().toArray().sort();
  };

  public shared ({ caller }) func reviewReport(reportId : Nat, newStatus : { #pending; #reviewed; #resolved }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only moderators and admins can review reports");
    };
    switch (reports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?report) {
        let updatedReport : Report = { report with status = newStatus };
        reports.add(reportId, updatedReport);
      };
    };
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    if (not posts.containsKey(postId)) {
      Runtime.trap("Post not found");
    };
    posts.remove(postId);
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete comments");
    };
    if (not comments.containsKey(commentId)) {
      Runtime.trap("Comment not found");
    };
    comments.remove(commentId);
  };

  public shared ({ caller }) func deleteForumPost(forumId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete forum posts");
    };
    if (not forumPosts.containsKey(forumId)) {
      Runtime.trap("Forum post not found");
    };
    forumPosts.remove(forumId);
  };

  public shared ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func updatePost(postId : Nat, content : Text, image : ?Storage.ExternalBlob, video : ?Storage.ExternalBlob, document : ?Storage.ExternalBlob) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };

    // Validate video size before accepting the upload
    validateVideoSize(video);

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (post.author != caller) {
          Runtime.trap("Unauthorized: You can only update your own posts");
        };
        let updatedPost : Post = {
          post with
          content;
          image;
          video;
          document;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePostByAuthor(postId : Nat) : async () {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete their own posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (post.author != caller) {
          Runtime.trap("Unauthorized: You can only delete your own posts");
        };
        posts.remove(postId);
      };
    };
  };

  public shared ({ caller }) func getUserPosts(user : Principal) : async [Post] {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.values().toArray().filter(func(post) { post.author == user });
  };

  public shared ({ caller }) func getUserComments(user : Principal) : async [Comment] {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view comments");
    };
    comments.values().toArray().filter(func(comment) { comment.author == user });
  };

  public shared ({ caller }) func getPostComments(postId : Nat) : async [Comment] {
    checkUserProfileExists(caller);
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view comments");
    };
    comments.values().toArray().filter(func(comment) { comment.postId == postId });
  };
};
