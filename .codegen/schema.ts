export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  token: Scalars['String']['output'];
  user: User;
};

export type CreateJobInput = {
  description: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateQuoteInput = {
  jobId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  pricePence: Scalars['Int']['input'];
};

export type Job = {
  createdAt: Scalars['DateTime']['output'];
  createdByUserId: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  photos: Array<Scalars['String']['output']>;
  quotes: Array<Quote>;
  title: Scalars['String']['output'];
};

export type Mutation = {
  createJob: Job;
  createQuote: Quote;
  login: AuthPayload;
  register: AuthPayload;
};


export type MutationCreateJobArgs = {
  input: CreateJobInput;
};


export type MutationCreateQuoteArgs = {
  input: CreateQuoteInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  health: Scalars['String']['output'];
  job?: Maybe<Job>;
  jobs: Array<Job>;
  me?: Maybe<User>;
};


export type QueryJobArgs = {
  id: Scalars['ID']['input'];
};

export type Quote = {
  createdAt: Scalars['DateTime']['output'];
  handymanUserId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  jobId: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  pricePence: Scalars['Int']['output'];
};

export type User = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { register: { token: string, user: { id: string, email: string } } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { token: string, user: { id: string, email: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me?: { id: string, email: string, createdAt: any } | null };

export type CreateJobMutationVariables = Exact<{
  input: CreateJobInput;
}>;


export type CreateJobMutation = { createJob: { id: string, title: string, description: string, location?: string | null } };

export type CreateQuoteMutationVariables = Exact<{
  input: CreateQuoteInput;
}>;


export type CreateQuoteMutation = { createQuote: { id: string, pricePence: number, message?: string | null } };

export type JobsQueryVariables = Exact<{ [key: string]: never; }>;


export type JobsQuery = { jobs: Array<{ id: string, title: string, description: string, location?: string | null, photos: Array<string>, createdByUserId: string, createdAt: any, quotes: Array<{ id: string, jobId: string, handymanUserId: string, pricePence: number, message?: string | null, createdAt: any }> }> };

export type JobQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type JobQuery = { job?: { id: string, title: string, description: string, location?: string | null, photos: Array<string>, createdAt: any, quotes: Array<{ id: string, pricePence: number, message?: string | null, handymanUserId: string }> } | null };

/* -------------------------------------------------------------------------- */
/* Fallback operation types when `bun run codegen` cannot reach the GraphQL   */
/* API (e.g. CSRF in CI). Successful codegen replaces this file entirely.     */
/* -------------------------------------------------------------------------- */

export enum TaskPaymentMethod {
  Cash = 'CASH',
  BankTransfer = 'BANK_TRANSFER',
}

export type CreateTaskInput = {
  title: Scalars['String']['input'];
  description: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  dateTime: Scalars['DateTime']['input'];
  category: Scalars['String']['input'];
  priceOfferPence: Scalars['Int']['input'];
  paymentMethod: TaskPaymentMethod;
  contactMethod: Scalars['String']['input'];
};

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;

export type CreateTaskMutation = { createTask: { id: string, title: string, description: string, location?: string | null, dateTime: any, category?: string | null, priceOfferPence?: number | null, paymentMethod?: string | null, contactMethod?: string | null } };

export type AddOfferInput = {
  taskId: Scalars['ID']['input'];
  pricePence: Scalars['Int']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type AddOfferMutationVariables = Exact<{
  input: AddOfferInput;
}>;

export type AddOfferMutation = { addOffer: { id: string, pricePence: number, message?: string | null } };

export type TaskQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type TaskQuery = { task?: { id: string, title: string, description: string, location?: string | null, status: string, createdByUserId: string, createdAt: any, dateTime?: any | null, category?: string | null, priceOfferPence?: number | null, paymentMethod?: string | null, contactMethod?: string | null, offers: Array<{ id: string, taskId: string, pricePence: number, message?: string | null, workerUserId: string, status: string, createdAt: any }> } | null };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;

export type ForgotPasswordMutation = { forgotPassword: { success: boolean, resetToken?: string | null } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;

export type ResetPasswordMutation = { resetPassword: { token: string, user: { id: string, email: string } } };
