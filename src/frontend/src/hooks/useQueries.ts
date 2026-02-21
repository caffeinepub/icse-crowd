import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Post, Report, UserRole, Variant_resolved_pending_reviewed, Comment, StudyGroup, StudyGroupMessage } from '../backend';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal?.toString() ?? 'null'],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; academicDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserProfile(data.name, data.email, data.academicDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['feed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      content: string; 
      image: ExternalBlob | null;
      video: ExternalBlob | null;
      document: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(data.content, data.image, data.video, data.document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useGetPostComments(postId: bigint, options?: { enabled?: boolean }) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['postComments', postId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPostComments(postId);
    },
    enabled: !!actor && !actorFetching && (options?.enabled ?? true),
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(data.postId, data.content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['postComments', variables.postId.toString()] });
    },
  });
}

export function useSendFriendRequest() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (to: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendFriendRequest(to);
    },
  });
}

export function useAcceptFriendRequest() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (from: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptFriendRequest(from);
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { to: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(data.to, data.content);
    },
  });
}

export function useGetAllStudyGroups() {
  const { actor, isFetching } = useActor();

  return useQuery<StudyGroup[]>({
    queryKey: ['studyGroups'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudyGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudyGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudyGroup(data.name, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
    },
  });
}

export function useJoinStudyGroup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinStudyGroup(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyGroups'] });
    },
  });
}

export function useGetStudyGroupMessages(groupId: bigint | null, options?: { enabled?: boolean; refetchInterval?: number }) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StudyGroupMessage[]>({
    queryKey: ['studyGroupMessages', groupId?.toString() ?? 'null'],
    queryFn: async () => {
      if (!actor || !groupId) return [];
      return actor.getStudyGroupMessages(groupId);
    },
    enabled: !!actor && !actorFetching && !!groupId && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
}

export function useSendStudyGroupMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { groupId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendStudyGroupMessage(data.groupId, data.content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['studyGroupMessages', variables.groupId.toString()] });
    },
  });
}

export function useAddSharedNote() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { groupId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSharedNote(data.groupId, data.content);
    },
  });
}

export function useCreateForumPost() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { subject: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createForumPost(data.subject, data.content);
    },
  });
}

export function useReportContent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      reportedUser: Principal | null;
      reportedContent: string | null;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reportContent(data.reportedUser, data.reportedContent, data.reason);
    },
  });
}

export function useBlockUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockUser(user);
    },
  });
}

export function useGetReports() {
  const { actor, isFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReviewReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      reportId: bigint;
      newStatus: Variant_resolved_pending_reviewed;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reviewReport(data.reportId, data.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
