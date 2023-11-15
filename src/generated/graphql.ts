import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  EmailAddress: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
  URL: { input: any; output: any; }
};

export type Aspect = {
  __typename?: 'Aspect';
  aspect: Scalars['String']['output'];
  aspectId: Scalars['ID']['output'];
  tags: Array<Tag>;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  comment: Scalars['String']['output'];
  commentId: Scalars['ID']['output'];
  createdAt: Scalars['Timestamp']['output'];
  updatedAt?: Maybe<Scalars['Timestamp']['output']>;
};

export type Community = {
  __typename?: 'Community';
  community: Scalars['String']['output'];
  communityId: Scalars['ID']['output'];
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  nametag: Scalars['String']['output'];
  privacy: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  users: Array<Maybe<UserWithRole>>;
};

export type Goal = {
  __typename?: 'Goal';
  createdAt: Scalars['Timestamp']['output'];
  deadline?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  goalId: Scalars['ID']['output'];
  goalQnas?: Maybe<Array<Maybe<GoalQna>>>;
  isDone: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  relatedArea?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  streak: Scalars['Int']['output'];
  tasks: Array<Task>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Timestamp']['output']>;
};

export type GoalQna = {
  __typename?: 'GoalQna';
  answer: Scalars['String']['output'];
  goalQnaId: Scalars['ID']['output'];
  question: Scalars['String']['output'];
};

export type Journal = {
  __typename?: 'Journal';
  access: Scalars['String']['output'];
  comments: Array<Comment>;
  content: Scalars['String']['output'];
  date: Scalars['Timestamp']['output'];
  journalId: Scalars['ID']['output'];
  likedBy: Array<JournalLike>;
  sharedBy: Array<JournalShare>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type JournalLike = {
  __typename?: 'JournalLike';
  likedAt: Scalars['Timestamp']['output'];
  likedBy: User;
};

export type JournalShare = {
  __typename?: 'JournalShare';
  sharedAt: Scalars['Timestamp']['output'];
  sharedBy: User;
  sharedIn: Community;
};

export type Milestone = {
  __typename?: 'Milestone';
  createdAt: Scalars['Timestamp']['output'];
  milestone: Scalars['String']['output'];
  milestoneId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setUser: Scalars['String']['output'];
};


export type MutationSetUserArgs = {
  userId: Scalars['ID']['input'];
};

export type Pausetime = {
  __typename?: 'Pausetime';
  pauseTime: Scalars['Timestamp']['output'];
  pausetimeId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAllAspects: Array<Aspect>;
  getAllQuestions: Array<Question>;
  getGoals: Array<Goal>;
  getTasks: Array<Task>;
  getTodos: Array<Todo>;
  getUsers: Array<User>;
};


export type QueryGetGoalsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetTasksArgs = {
  goalId: Scalars['ID']['input'];
};


export type QueryGetTodosArgs = {
  taskId: Scalars['ID']['input'];
};

export type Question = {
  __typename?: 'Question';
  options: Array<Scalars['String']['output']>;
  question: Scalars['String']['output'];
  questionId: Scalars['ID']['output'];
};

export type Resumetime = {
  __typename?: 'Resumetime';
  resumeTime: Scalars['Timestamp']['output'];
  resumetimeId: Scalars['ID']['output'];
};

export type Tag = {
  __typename?: 'Tag';
  tag: Scalars['String']['output'];
  tagId: Scalars['ID']['output'];
};

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['Timestamp']['output'];
  deadline?: Maybe<Scalars['Timestamp']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isDone: Scalars['Boolean']['output'];
  milestones?: Maybe<Array<Maybe<Milestone>>>;
  order: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
  streak: Scalars['Int']['output'];
  taskId: Scalars['ID']['output'];
  timelapsed?: Maybe<Timelapse>;
  title: Scalars['String']['output'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updatedAt?: Maybe<Scalars['Timestamp']['output']>;
};

export type TimeDuration = {
  __typename?: 'TimeDuration';
  days: Scalars['Int']['output'];
  hours: Scalars['Int']['output'];
  minutes: Scalars['Int']['output'];
  seconds: Scalars['Int']['output'];
};

export type Timelapse = {
  __typename?: 'Timelapse';
  duration?: Maybe<TimeDuration>;
  endTime?: Maybe<Scalars['Timestamp']['output']>;
  pausetimes?: Maybe<Array<Maybe<Pausetime>>>;
  resumetimes?: Maybe<Array<Maybe<Resumetime>>>;
  startTime: Scalars['Timestamp']['output'];
  timelapseId: Scalars['ID']['output'];
};

export type Todo = {
  __typename?: 'Todo';
  createdAt: Scalars['Timestamp']['output'];
  isDone: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  timelapsed?: Maybe<Timelapse>;
  todo: Scalars['String']['output'];
  todoId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['Timestamp']['output']>;
};

export type User = {
  __typename?: 'User';
  aspects: Array<Aspect>;
  banned: Scalars['Boolean']['output'];
  createdAt: Scalars['Timestamp']['output'];
  emailAddresses: Array<UserEmailAddress>;
  firstName: Scalars['String']['output'];
  goals: Array<Goal>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['URL']['output'];
  journals: Array<Journal>;
  lastName: Scalars['String']['output'];
  questions?: Maybe<Array<Maybe<Question>>>;
  updatedAt: Scalars['Timestamp']['output'];
  username: Scalars['String']['output'];
};

export type UserEmailAddress = {
  __typename?: 'UserEmailAddress';
  emailAddress: Scalars['EmailAddress']['output'];
  isPrimary: Scalars['Boolean']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserWithRole = {
  __typename?: 'UserWithRole';
  role: Scalars['String']['output'];
  user: User;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Aspect: ResolverTypeWrapper<Aspect>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  Community: ResolverTypeWrapper<Community>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']['output']>;
  Goal: ResolverTypeWrapper<Goal>;
  GoalQna: ResolverTypeWrapper<GoalQna>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Journal: ResolverTypeWrapper<Journal>;
  JournalLike: ResolverTypeWrapper<JournalLike>;
  JournalShare: ResolverTypeWrapper<JournalShare>;
  Milestone: ResolverTypeWrapper<Milestone>;
  Mutation: ResolverTypeWrapper<{}>;
  Pausetime: ResolverTypeWrapper<Pausetime>;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolverTypeWrapper<Question>;
  Resumetime: ResolverTypeWrapper<Resumetime>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  Task: ResolverTypeWrapper<Task>;
  TimeDuration: ResolverTypeWrapper<TimeDuration>;
  Timelapse: ResolverTypeWrapper<Timelapse>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  Todo: ResolverTypeWrapper<Todo>;
  URL: ResolverTypeWrapper<Scalars['URL']['output']>;
  User: ResolverTypeWrapper<User>;
  UserEmailAddress: ResolverTypeWrapper<UserEmailAddress>;
  UserWithRole: ResolverTypeWrapper<UserWithRole>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Aspect: Aspect;
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  Community: Community;
  EmailAddress: Scalars['EmailAddress']['output'];
  Goal: Goal;
  GoalQna: GoalQna;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Journal: Journal;
  JournalLike: JournalLike;
  JournalShare: JournalShare;
  Milestone: Milestone;
  Mutation: {};
  Pausetime: Pausetime;
  Query: {};
  Question: Question;
  Resumetime: Resumetime;
  String: Scalars['String']['output'];
  Tag: Tag;
  Task: Task;
  TimeDuration: TimeDuration;
  Timelapse: Timelapse;
  Timestamp: Scalars['Timestamp']['output'];
  Todo: Todo;
  URL: Scalars['URL']['output'];
  User: User;
  UserEmailAddress: UserEmailAddress;
  UserWithRole: UserWithRole;
};

export type AspectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Aspect'] = ResolversParentTypes['Aspect']> = {
  aspect?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aspectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Community'] = ResolversParentTypes['Community']> = {
  community?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  communityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nametag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  privacy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  users?: Resolver<Array<Maybe<ResolversTypes['UserWithRole']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type GoalResolvers<ContextType = any, ParentType extends ResolversParentTypes['Goal'] = ResolversParentTypes['Goal']> = {
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  deadline?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  goalQnas?: Resolver<Maybe<Array<Maybe<ResolversTypes['GoalQna']>>>, ParentType, ContextType>;
  isDone?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relatedArea?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GoalQnaResolvers<ContextType = any, ParentType extends ResolversParentTypes['GoalQna'] = ResolversParentTypes['GoalQna']> = {
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goalQnaId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JournalResolvers<ContextType = any, ParentType extends ResolversParentTypes['Journal'] = ResolversParentTypes['Journal']> = {
  access?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  journalId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likedBy?: Resolver<Array<ResolversTypes['JournalLike']>, ParentType, ContextType>;
  sharedBy?: Resolver<Array<ResolversTypes['JournalShare']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JournalLikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalLike'] = ResolversParentTypes['JournalLike']> = {
  likedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  likedBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JournalShareResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalShare'] = ResolversParentTypes['JournalShare']> = {
  sharedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  sharedBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sharedIn?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MilestoneResolvers<ContextType = any, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = {
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  milestone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  milestoneId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  setUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationSetUserArgs, 'userId'>>;
};

export type PausetimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pausetime'] = ResolversParentTypes['Pausetime']> = {
  pauseTime?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  pausetimeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllAspects?: Resolver<Array<ResolversTypes['Aspect']>, ParentType, ContextType>;
  getAllQuestions?: Resolver<Array<ResolversTypes['Question']>, ParentType, ContextType>;
  getGoals?: Resolver<Array<ResolversTypes['Goal']>, ParentType, ContextType, RequireFields<QueryGetGoalsArgs, 'userId'>>;
  getTasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryGetTasksArgs, 'goalId'>>;
  getTodos?: Resolver<Array<ResolversTypes['Todo']>, ParentType, ContextType, RequireFields<QueryGetTodosArgs, 'taskId'>>;
  getUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  options?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResumetimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Resumetime'] = ResolversParentTypes['Resumetime']> = {
  resumeTime?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  resumetimeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  tag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tagId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  deadline?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDone?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  milestones?: Resolver<Maybe<Array<Maybe<ResolversTypes['Milestone']>>>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taskId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timelapsed?: Resolver<Maybe<ResolversTypes['Timelapse']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimeDurationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeDuration'] = ResolversParentTypes['TimeDuration']> = {
  days?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hours?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  seconds?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimelapseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Timelapse'] = ResolversParentTypes['Timelapse']> = {
  duration?: Resolver<Maybe<ResolversTypes['TimeDuration']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  pausetimes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Pausetime']>>>, ParentType, ContextType>;
  resumetimes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Resumetime']>>>, ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  timelapseId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type TodoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = {
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  isDone?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timelapsed?: Resolver<Maybe<ResolversTypes['Timelapse']>, ParentType, ContextType>;
  todo?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todoId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  aspects?: Resolver<Array<ResolversTypes['Aspect']>, ParentType, ContextType>;
  banned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  emailAddresses?: Resolver<Array<ResolversTypes['UserEmailAddress']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goals?: Resolver<Array<ResolversTypes['Goal']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  journals?: Resolver<Array<ResolversTypes['Journal']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Question']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEmailAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserEmailAddress'] = ResolversParentTypes['UserEmailAddress']> = {
  emailAddress?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserWithRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserWithRole'] = ResolversParentTypes['UserWithRole']> = {
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Aspect?: AspectResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Community?: CommunityResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  Goal?: GoalResolvers<ContextType>;
  GoalQna?: GoalQnaResolvers<ContextType>;
  Journal?: JournalResolvers<ContextType>;
  JournalLike?: JournalLikeResolvers<ContextType>;
  JournalShare?: JournalShareResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Pausetime?: PausetimeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Resumetime?: ResumetimeResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TimeDuration?: TimeDurationResolvers<ContextType>;
  Timelapse?: TimelapseResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Todo?: TodoResolvers<ContextType>;
  URL?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserEmailAddress?: UserEmailAddressResolvers<ContextType>;
  UserWithRole?: UserWithRoleResolvers<ContextType>;
};

