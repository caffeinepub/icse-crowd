import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface StudyGroup {
    id: bigint;
    creator: Principal;
    members: Array<Principal>;
    name: string;
    description: string;
}
export interface Comment {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: Time;
    postId: bigint;
}
export interface Post {
    id: bigint;
    content: string;
    video?: ExternalBlob;
    author: Principal;
    likes: Array<Principal>;
    document?: ExternalBlob;
    timestamp: Time;
    image?: ExternalBlob;
}
export interface Report {
    id: bigint;
    status: Variant_resolved_pending_reviewed;
    reportedContent?: string;
    reportedUser?: Principal;
    timestamp: Time;
    reporter: Principal;
    reason: string;
}
export interface UserProfile {
    blockedUsers: Array<Principal>;
    principal: Principal;
    name: string;
    role: UserRole;
    email: string;
    academicDetails: string;
}
export interface StudyGroupMessage {
    id: bigint;
    content: string;
    sender: Principal;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_resolved_pending_reviewed {
    resolved = "resolved",
    pending = "pending",
    reviewed = "reviewed"
}
export interface backendInterface {
    acceptFriendRequest(from: Principal): Promise<void>;
    addBannedWord(word: string): Promise<void>;
    addComment(postId: bigint, content: string): Promise<void>;
    addSharedNote(groupId: bigint, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    createForumPost(subject: string, content: string): Promise<void>;
    createPost(content: string, image: ExternalBlob | null, video: ExternalBlob | null, document: ExternalBlob | null): Promise<void>;
    createStudyGroup(name: string, description: string): Promise<void>;
    createUserProfile(name: string, email: string, academicDetails: string): Promise<void>;
    deleteComment(commentId: bigint): Promise<void>;
    deleteForumPost(forumId: bigint): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    deletePostByAuthor(postId: bigint): Promise<void>;
    deleteStudyGroup(groupId: bigint): Promise<void>;
    getAllComments(): Promise<Array<Comment>>;
    getAllPosts(): Promise<Array<Post>>;
    getAllStudyGroups(): Promise<Array<StudyGroup>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(): Promise<Array<Post>>;
    getPlatformStats(): Promise<[bigint, bigint, bigint, bigint, bigint]>;
    getPostComments(postId: bigint): Promise<Array<Comment>>;
    getReports(): Promise<Array<Report>>;
    getStudyGroup(groupId: bigint): Promise<StudyGroup | null>;
    getStudyGroupMessages(groupId: bigint): Promise<Array<StudyGroupMessage>>;
    getSuspendedUsers(): Promise<Array<Principal>>;
    getUserComments(user: Principal): Promise<Array<Comment>>;
    getUserPosts(user: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinStudyGroup(groupId: bigint): Promise<void>;
    likePost(postId: bigint): Promise<void>;
    listBannedWords(): Promise<Array<string>>;
    removeBannedWord(word: string): Promise<void>;
    reportContent(reportedUser: Principal | null, reportedContent: string | null, reason: string): Promise<void>;
    reviewReport(reportId: bigint, newStatus: Variant_resolved_pending_reviewed): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    scanAndDeleteBannedGroups(): Promise<void>;
    sendFriendRequest(to: Principal): Promise<void>;
    sendMessage(to: Principal, content: string): Promise<void>;
    sendStudyGroupMessage(groupId: bigint, content: string): Promise<void>;
    suspendUser(user: Principal): Promise<void>;
    unsuspendUser(user: Principal): Promise<void>;
    updatePost(postId: bigint, content: string, image: ExternalBlob | null, video: ExternalBlob | null, document: ExternalBlob | null): Promise<void>;
}
