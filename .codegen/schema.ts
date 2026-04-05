export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  DateTime: { input: any; output: any }
}

export type AcceptOfferInput = {
  location?: InputMaybe<LocationInput>
  offerId: Scalars['ID']['input']
  preferredDate?: InputMaybe<Scalars['DateTime']['input']>
}

export type AddOfferInput = {
  message?: InputMaybe<Scalars['String']['input']>
  pricePence: Scalars['Int']['input']
  taskId: Scalars['ID']['input']
}

export type AddReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>
  rating: Scalars['Int']['input']
  taskId: Scalars['ID']['input']
}

export type AddTaskCommentInput = {
  body: Scalars['String']['input']
  taskId: Scalars['ID']['input']
}

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

export type AuthPayload = {
  token: Scalars['String']['output']
  user: User
}

export type BudgetRange = {
  max?: Maybe<Scalars['Float']['output']>
  min?: Maybe<Scalars['Float']['output']>
}

export type BudgetRangeInput = {
  max?: InputMaybe<Scalars['Float']['input']>
  min?: InputMaybe<Scalars['Float']['input']>
}

export type Category = {
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
}

export type CreateTaskInput = {
  category: Scalars['String']['input']
  contactMethod: Scalars['String']['input']
  dateTime: Scalars['DateTime']['input']
  description: Scalars['String']['input']
  images?: InputMaybe<Array<Scalars['String']['input']>>
  location: Scalars['String']['input']
  paymentMethod: TaskPaymentMethod
  priceOfferPence: Scalars['Int']['input']
  title: Scalars['String']['input']
}

export type Endorsement = {
  comment?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  endorser: User
  endorserUserId: Scalars['ID']['output']
  id: Scalars['ID']['output']
  professionalProfileId: Scalars['ID']['output']
  skill: Skill
  skillId: Scalars['ID']['output']
}

export type ForgotPasswordPayload = {
  resetToken?: Maybe<Scalars['String']['output']>
  success: Scalars['Boolean']['output']
}

export type Location = {
  address?: Maybe<Scalars['String']['output']>
  lat?: Maybe<Scalars['Float']['output']>
  lng?: Maybe<Scalars['Float']['output']>
}

export type LocationInput = {
  address?: InputMaybe<Scalars['String']['input']>
  lat?: InputMaybe<Scalars['Float']['input']>
  lng?: InputMaybe<Scalars['Float']['input']>
}

export type LoginInput = {
  email?: InputMaybe<Scalars['String']['input']>
  method?: LoginMethod
  oauthToken?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
}

export enum LoginMethod {
  Apple = 'APPLE',
  Google = 'GOOGLE',
  Password = 'PASSWORD',
}

export enum MembershipTier {
  Elite = 'ELITE',
  Free = 'FREE',
  Plus = 'PLUS',
  Pro = 'PRO',
}

export type Mutation = {
  _empty?: Maybe<Scalars['String']['output']>
  acceptOffer: Task
  addOffer: Offer
  addReview: Review
  addTaskComment: TaskComment
  cancelTask: Task
  completeTask: Task
  confirmTask: Task
  createTask: Task
  endorseProfessional: Endorsement
  forgotPassword: ForgotPasswordPayload
  login: AuthPayload
  loginWithMethod: AuthPayload
  makeOffer: Offer
  markTaskComplete: Task
  postTask: Task
  rateProfessional: Review
  register: AuthPayload
  registerAsPro: ProfessionalProfile
  resetPassword: AuthPayload
  switchMode: User
  updateMyMembership: UserMembership
  updateMyProfile: User
  updateMySettings: User
  upgradeToProMembership: ProfessionalProfile
}

export type MutationAcceptOfferArgs = {
  input?: InputMaybe<AcceptOfferInput>
  offerId?: InputMaybe<Scalars['ID']['input']>
}

export type MutationAddOfferArgs = {
  input: AddOfferInput
}

export type MutationAddReviewArgs = {
  input: AddReviewInput
}

export type MutationAddTaskCommentArgs = {
  input: AddTaskCommentInput
}

export type MutationCancelTaskArgs = {
  taskId: Scalars['ID']['input']
}

export type MutationCompleteTaskArgs = {
  taskId: Scalars['ID']['input']
}

export type MutationConfirmTaskArgs = {
  taskId: Scalars['ID']['input']
}

export type MutationCreateTaskArgs = {
  input: CreateTaskInput
  token?: InputMaybe<Scalars['String']['input']>
}

export type MutationEndorseProfessionalArgs = {
  comment?: InputMaybe<Scalars['String']['input']>
  professionalId: Scalars['ID']['input']
  skillId: Scalars['ID']['input']
}

export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input']
}

export type MutationLoginArgs = {
  email: Scalars['String']['input']
  method?: LoginMethod
  password: Scalars['String']['input']
}

export type MutationLoginWithMethodArgs = {
  input: LoginInput
}

export type MutationMakeOfferArgs = {
  amount: Scalars['Float']['input']
  message?: InputMaybe<Scalars['String']['input']>
  taskId: Scalars['ID']['input']
}

export type MutationMarkTaskCompleteArgs = {
  taskId: Scalars['ID']['input']
}

export type MutationPostTaskArgs = {
  input: PostTaskInput
}

export type MutationRateProfessionalArgs = {
  input: RateProfessionalInput
}

export type MutationRegisterArgs = {
  contactNumber?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  name?: InputMaybe<Scalars['String']['input']>
  password: Scalars['String']['input']
}

export type MutationRegisterAsProArgs = {
  input: ProRegistrationInput
}

export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input']
  token: Scalars['String']['input']
}

export type MutationSwitchModeArgs = {
  mode: UserMode
}

export type MutationUpdateMyMembershipArgs = {
  input: UpdateMyMembershipInput
}

export type MutationUpdateMyProfileArgs = {
  input: UpdateMyProfileInput
}

export type MutationUpdateMySettingsArgs = {
  input: UpdateMySettingsInput
}

export type Offer = {
  amount: Scalars['Float']['output']
  createdAt: Scalars['DateTime']['output']
  estimatedDuration?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  message?: Maybe<Scalars['String']['output']>
  pricePence: Scalars['Int']['output']
  professional: User
  status: OfferStatus
  task: Task
  taskId: Scalars['ID']['output']
  workerUserId: Scalars['ID']['output']
}

export enum OfferStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Withdrawn = 'WITHDRAWN',
}

export type PaginationInfo = {
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  page: Scalars['Int']['output']
  pageSize: Scalars['Int']['output']
  totalItems: Scalars['Int']['output']
  totalPages: Scalars['Int']['output']
}

export type PaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export enum PaymentType {
  Cash = 'CASH',
}

export type PostTaskInput = {
  budgetRange?: InputMaybe<BudgetRangeInput>
  category: Scalars['String']['input']
  description: Scalars['String']['input']
  images?: InputMaybe<Array<Scalars['String']['input']>>
  location: LocationInput
  preferredDate?: InputMaybe<Scalars['DateTime']['input']>
  preferredTimeSlot?: InputMaybe<Scalars['String']['input']>
  title: Scalars['String']['input']
}

export type ProRegistrationInput = {
  bio?: InputMaybe<Scalars['String']['input']>
  firstName: Scalars['String']['input']
  lastName: Scalars['String']['input']
  location: LocationInput
  skills?: Array<Scalars['String']['input']>
  tagline?: InputMaybe<Scalars['String']['input']>
  yearsExperience?: InputMaybe<Scalars['Int']['input']>
}

export type ProfessionalProfile = {
  averageResponseTime?: Maybe<Scalars['String']['output']>
  bio?: Maybe<Scalars['String']['output']>
  endorsements: Array<Endorsement>
  id: Scalars['ID']['output']
  isProMember: Scalars['Boolean']['output']
  isVerified: Scalars['Boolean']['output']
  jobsCompletedCount?: Maybe<Scalars['Int']['output']>
  location: Location
  locationAddress?: Maybe<Scalars['String']['output']>
  locationLat?: Maybe<Scalars['Float']['output']>
  locationLng?: Maybe<Scalars['Float']['output']>
  rating?: Maybe<Scalars['Float']['output']>
  reviewCount?: Maybe<Scalars['Int']['output']>
  skills: Array<Skill>
  tagline?: Maybe<Scalars['String']['output']>
  user: User
  userId: Scalars['ID']['output']
  workHistory: Array<WorkHistoryItem>
  yearsExperience?: Maybe<Scalars['Int']['output']>
}

export type Query = {
  browseTasks: Array<Task>
  categories: Array<Category>
  health: Scalars['String']['output']
  me: User
  myTasks: Array<Task>
  professionalProfile?: Maybe<ProfessionalProfile>
  searchProfessionals: Array<ProfessionalProfile>
  task?: Maybe<Task>
  taskWorkflow?: Maybe<Task>
  tasks: TaskPage
  worker?: Maybe<WorkerProfile>
}

export type QueryBrowseTasksArgs = {
  category?: InputMaybe<Scalars['String']['input']>
  lat?: InputMaybe<Scalars['Float']['input']>
  lng?: InputMaybe<Scalars['Float']['input']>
  maxBudget?: InputMaybe<Scalars['Float']['input']>
  minBudget?: InputMaybe<Scalars['Float']['input']>
  radius?: InputMaybe<Scalars['Int']['input']>
}

export type QueryMyTasksArgs = {
  status?: InputMaybe<Array<TaskStatus>>
}

export type QueryProfessionalProfileArgs = {
  id: Scalars['ID']['input']
}

export type QuerySearchProfessionalsArgs = {
  location?: InputMaybe<Scalars['String']['input']>
  skill?: InputMaybe<Scalars['String']['input']>
}

export type QueryTaskArgs = {
  id: Scalars['ID']['input']
}

export type QueryTaskWorkflowArgs = {
  id: Scalars['ID']['input']
}

export type QueryTasksArgs = {
  category?: InputMaybe<Scalars['String']['input']>
  maxPricePence?: InputMaybe<Scalars['Int']['input']>
  minPricePence?: InputMaybe<Scalars['Int']['input']>
  pagination?: InputMaybe<PaginationInput>
}

export type QueryWorkerArgs = {
  id: Scalars['ID']['input']
}

export type RateProfessionalInput = {
  comment?: InputMaybe<Scalars['String']['input']>
  communicationRating?: InputMaybe<Scalars['Int']['input']>
  highlights?: InputMaybe<Array<Scalars['String']['input']>>
  punctualityRating?: InputMaybe<Scalars['Int']['input']>
  rating: Scalars['Int']['input']
  taskId: Scalars['ID']['input']
  workQualityRating?: InputMaybe<Scalars['Int']['input']>
}

export type Review = {
  comment?: Maybe<Scalars['String']['output']>
  communicationRating?: Maybe<Scalars['Int']['output']>
  createdAt: Scalars['DateTime']['output']
  customerUserId: Scalars['ID']['output']
  highlights?: Maybe<Array<Scalars['String']['output']>>
  id: Scalars['ID']['output']
  professional: User
  punctualityRating?: Maybe<Scalars['Int']['output']>
  rating: Scalars['Int']['output']
  reviewer: User
  task: Task
  taskId: Scalars['ID']['output']
  workQualityRating?: Maybe<Scalars['Int']['output']>
  workerUserId: Scalars['ID']['output']
}

export type Skill = {
  endorsementCount: Scalars['Int']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  professionalProfileId: Scalars['ID']['output']
}

export type Task = {
  budgetMax?: Maybe<Scalars['Float']['output']>
  budgetMin?: Maybe<Scalars['Float']['output']>
  budgetRange?: Maybe<BudgetRange>
  category?: Maybe<Scalars['String']['output']>
  comments: Array<TaskComment>
  completedAt?: Maybe<Scalars['DateTime']['output']>
  confirmedAt?: Maybe<Scalars['DateTime']['output']>
  contactMethod?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  createdByUserId: Scalars['ID']['output']
  dateTime?: Maybe<Scalars['DateTime']['output']>
  description: Scalars['String']['output']
  id: Scalars['ID']['output']
  images: Array<Scalars['String']['output']>
  location?: Maybe<Scalars['String']['output']>
  locationInfo: Location
  locationLat?: Maybe<Scalars['Float']['output']>
  locationLng?: Maybe<Scalars['Float']['output']>
  offers: Array<Offer>
  paymentMethod?: Maybe<TaskPaymentMethod>
  paymentType: PaymentType
  poster: User
  preferredDate?: Maybe<Scalars['DateTime']['output']>
  preferredTimeSlot?: Maybe<Scalars['String']['output']>
  priceOfferPence?: Maybe<Scalars['Int']['output']>
  review?: Maybe<Review>
  selectedOffer?: Maybe<Offer>
  selectedOfferId?: Maybe<Scalars['ID']['output']>
  status: TaskStatus
  title: Scalars['String']['output']
  workerUserId?: Maybe<Scalars['ID']['output']>
}

export type TaskComment = {
  body: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  taskId: Scalars['ID']['output']
  userId: Scalars['ID']['output']
}

export type TaskPage = {
  items: Array<Task>
  pageInfo: PaginationInfo
}

export enum TaskPaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
}

export enum TaskStatus {
  Awarded = 'AWARDED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  OfferAccepted = 'OFFER_ACCEPTED',
  Open = 'OPEN',
}

export type UpdateMyMembershipInput = {
  isPaid: Scalars['Boolean']['input']
  renewsAt?: InputMaybe<Scalars['DateTime']['input']>
  tier: MembershipTier
}

export type UpdateMyProfileInput = {
  contactNumber?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateMySettingsInput = {
  isProfilePrivate?: InputMaybe<Scalars['Boolean']['input']>
  marketingEmails?: InputMaybe<Scalars['Boolean']['input']>
}

export type User = {
  activeMode: UserMode
  avatarUrl?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  email: Scalars['String']['output']
  enabledLoginMethods: Array<LoginMethod>
  firstName: Scalars['String']['output']
  id: Scalars['ID']['output']
  isPro: Scalars['Boolean']['output']
  lastName: Scalars['String']['output']
  membership: UserMembership
  modes: Array<UserMode>
  proProfile?: Maybe<ProfessionalProfile>
  profile: UserProfile
  settings: UserSettings
  tasksPosted: Array<Task>
}

export type UserMembership = {
  isPaid: Scalars['Boolean']['output']
  renewsAt?: Maybe<Scalars['DateTime']['output']>
  tier: MembershipTier
}

export enum UserMode {
  Customer = 'CUSTOMER',
  Worker = 'WORKER',
}

export type UserProfile = {
  contactNumber?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
}

export type UserSettings = {
  isProfilePrivate: Scalars['Boolean']['output']
  marketingEmails: Scalars['Boolean']['output']
}

export type WorkHistoryItem = {
  category?: Maybe<Scalars['String']['output']>
  completionDate?: Maybe<Scalars['DateTime']['output']>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  images: Array<Scalars['String']['output']>
  professionalProfileId: Scalars['ID']['output']
  title: Scalars['String']['output']
}

export type WorkerProfile = {
  averageRating?: Maybe<Scalars['Float']['output']>
  reviewCount: Scalars['Int']['output']
  reviews: Array<Review>
  workerUserId: Scalars['ID']['output']
}

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type RegisterMutation = {
  register: { token: string; user: { id: string; email: string } }
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type LoginMutation = {
  login: { token: string; user: { id: string; email: string } }
}

export type LoginWithMethodMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginWithMethodMutation = {
  loginWithMethod: {
    token: string
    user: { id: string; email: string; activeMode: UserMode }
  }
}

export type SwitchModeMutationVariables = Exact<{
  mode: UserMode
}>

export type SwitchModeMutation = {
  switchMode: { id: string; email: string; activeMode: UserMode }
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = { me: { id: string; email: string; createdAt: any } }

export type HealthQueryVariables = Exact<{ [key: string]: never }>

export type HealthQuery = { health: string }

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input']
}>

export type ForgotPasswordMutation = {
  forgotPassword: { success: boolean; resetToken?: string | null }
}

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input']
  newPassword: Scalars['String']['input']
}>

export type ResetPasswordMutation = {
  resetPassword: { token: string; user: { id: string; email: string } }
}

export type CategoriesQueryVariables = Exact<{ [key: string]: never }>

export type CategoriesQuery = {
  categories: Array<{ id: string; name: string; createdAt: any }>
}

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput
}>

export type CreateTaskMutation = {
  createTask: {
    id: string
    title: string
    description: string
    location?: string | null
    dateTime?: any | null
    category?: string | null
    priceOfferPence?: number | null
    paymentMethod?: TaskPaymentMethod | null
    contactMethod?: string | null
  }
}

export type AddOfferMutationVariables = Exact<{
  input: AddOfferInput
}>

export type AddOfferMutation = {
  addOffer: { id: string; pricePence: number; message?: string | null }
}

export type TasksQueryVariables = Exact<{ [key: string]: never }>

export type TasksQuery = {
  tasks: {
    items: Array<{
      id: string
      title: string
      description: string
      location?: string | null
      status: TaskStatus
      createdByUserId: string
      createdAt: any
      dateTime?: any | null
      category?: string | null
      priceOfferPence?: number | null
      paymentMethod?: TaskPaymentMethod | null
      contactMethod?: string | null
      offers: Array<{
        id: string
        taskId: string
        workerUserId: string
        pricePence: number
        message?: string | null
        status: OfferStatus
        createdAt: any
      }>
    }>
    pageInfo: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export type TaskQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type TaskQuery = {
  task?: {
    id: string
    title: string
    description: string
    location?: string | null
    status: TaskStatus
    createdByUserId: string
    createdAt: any
    dateTime?: any | null
    category?: string | null
    priceOfferPence?: number | null
    paymentMethod?: TaskPaymentMethod | null
    contactMethod?: string | null
    offers: Array<{
      id: string
      taskId: string
      pricePence: number
      message?: string | null
      workerUserId: string
      status: OfferStatus
      createdAt: any
    }>
  } | null
}

export type BrowseTasksQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>
  lat?: InputMaybe<Scalars['Float']['input']>
  lng?: InputMaybe<Scalars['Float']['input']>
  maxBudget?: InputMaybe<Scalars['Float']['input']>
  minBudget?: InputMaybe<Scalars['Float']['input']>
  radius?: InputMaybe<Scalars['Int']['input']>
}>

export type BrowseTasksQuery = {
  browseTasks: Array<{
    id: string
    title: string
    description: string
    location?: string | null
    status: TaskStatus
    priceOfferPence?: number | null
    createdAt: any
    category?: string | null
  }>
}

export type MyTasksQueryVariables = Exact<{
  status?: InputMaybe<Array<TaskStatus> | TaskStatus>
}>

export type MyTasksQuery = {
  myTasks: Array<{
    id: string
    title: string
    description: string
    status: TaskStatus
    createdAt: any
  }>
}

export type TaskWorkflowQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type TaskWorkflowQuery = {
  taskWorkflow?: {
    id: string
    status: TaskStatus
    offers: Array<{ id: string; status: OfferStatus; pricePence: number }>
  } | null
}

export type AcceptOfferMutationVariables = Exact<{
  input?: InputMaybe<AcceptOfferInput>
  offerId?: InputMaybe<Scalars['ID']['input']>
}>

export type AcceptOfferMutation = {
  acceptOffer: {
    id: string
    status: TaskStatus
    selectedOfferId?: string | null
  }
}

export type MakeOfferMutationVariables = Exact<{
  amount: Scalars['Float']['input']
  taskId: Scalars['ID']['input']
  message?: InputMaybe<Scalars['String']['input']>
}>

export type MakeOfferMutation = {
  makeOffer: {
    id: string
    amount: number
    message?: string | null
    status: OfferStatus
  }
}

export type AddTaskCommentMutationVariables = Exact<{
  input: AddTaskCommentInput
}>

export type AddTaskCommentMutation = {
  addTaskComment: { id: string; body: string; createdAt: any; userId: string }
}

export type CancelTaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input']
}>

export type CancelTaskMutation = {
  cancelTask: { id: string; status: TaskStatus }
}

export type CompleteTaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input']
}>

export type CompleteTaskMutation = {
  completeTask: { id: string; status: TaskStatus; completedAt?: any | null }
}

export type ConfirmTaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input']
}>

export type ConfirmTaskMutation = {
  confirmTask: { id: string; status: TaskStatus; confirmedAt?: any | null }
}

export type MarkTaskCompleteMutationVariables = Exact<{
  taskId: Scalars['ID']['input']
}>

export type MarkTaskCompleteMutation = {
  markTaskComplete: { id: string; status: TaskStatus; completedAt?: any | null }
}

export type PostTaskMutationVariables = Exact<{
  input: PostTaskInput
}>

export type PostTaskMutation = {
  postTask: {
    id: string
    title: string
    description: string
    status: TaskStatus
  }
}

export type AddReviewMutationVariables = Exact<{
  input: AddReviewInput
}>

export type AddReviewMutation = {
  addReview: {
    id: string
    rating: number
    comment?: string | null
    createdAt: any
  }
}

export type EndorseProfessionalMutationVariables = Exact<{
  comment?: InputMaybe<Scalars['String']['input']>
  professionalId: Scalars['ID']['input']
  skillId: Scalars['ID']['input']
}>

export type EndorseProfessionalMutation = {
  endorseProfessional: { id: string; comment?: string | null; createdAt: any }
}

export type RateProfessionalMutationVariables = Exact<{
  input: RateProfessionalInput
}>

export type RateProfessionalMutation = {
  rateProfessional: {
    id: string
    rating: number
    comment?: string | null
    communicationRating?: number | null
    punctualityRating?: number | null
    workQualityRating?: number | null
  }
}

export type ProfessionalProfileQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type ProfessionalProfileQuery = {
  professionalProfile?: {
    id: string
    bio?: string | null
    isVerified: boolean
    rating?: number | null
    reviewCount?: number | null
    yearsExperience?: number | null
    location: {
      address?: string | null
      lat?: number | null
      lng?: number | null
    }
    skills: Array<{ id: string; name: string }>
  } | null
}

export type SearchProfessionalsQueryVariables = Exact<{
  location?: InputMaybe<Scalars['String']['input']>
  skill?: InputMaybe<Scalars['String']['input']>
}>

export type SearchProfessionalsQuery = {
  searchProfessionals: Array<{
    id: string
    bio?: string | null
    rating?: number | null
    reviewCount?: number | null
    user: { id: string; firstName: string; lastName: string }
  }>
}

export type WorkerQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type WorkerQuery = {
  worker?: {
    workerUserId: string
    averageRating?: number | null
    reviewCount: number
  } | null
}

export type RegisterAsProMutationVariables = Exact<{
  input: ProRegistrationInput
}>

export type RegisterAsProMutation = {
  registerAsPro: { id: string; isProMember: boolean }
}

export type UpdateMyMembershipMutationVariables = Exact<{
  input: UpdateMyMembershipInput
}>

export type UpdateMyMembershipMutation = {
  updateMyMembership: {
    isPaid: boolean
    tier: MembershipTier
    renewsAt?: any | null
  }
}

export type UpdateMyProfileMutationVariables = Exact<{
  input: UpdateMyProfileInput
}>

export type UpdateMyProfileMutation = {
  updateMyProfile: {
    id: string
    profile: { name?: string | null; contactNumber?: string | null }
  }
}

export type UpdateMySettingsMutationVariables = Exact<{
  input: UpdateMySettingsInput
}>

export type UpdateMySettingsMutation = {
  updateMySettings: {
    id: string
    settings: { isProfilePrivate: boolean; marketingEmails: boolean }
  }
}

export type UpgradeToProMembershipMutationVariables = Exact<{
  [key: string]: never
}>

export type UpgradeToProMembershipMutation = {
  upgradeToProMembership: { id: string; isProMember: boolean }
}
