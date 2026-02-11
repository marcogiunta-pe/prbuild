-- Performance indexes for frequently queried columns

-- release_requests: queried by client_id in dashboard, filtered by status in admin
CREATE INDEX IF NOT EXISTS idx_release_requests_client_id ON public.release_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_release_requests_status ON public.release_requests(status);

-- journalist_subscribers: filtered by is_verified when sending newsletters
CREATE INDEX IF NOT EXISTS idx_journalist_subscribers_is_verified ON public.journalist_subscribers(is_verified);

-- profiles: looked up by stripe_customer_id in webhook handler
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- invites: looked up by email when checking for existing requests
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.invites(email);

-- activity_log: queried by release_request_id for release history
CREATE INDEX IF NOT EXISTS idx_activity_log_release_request_id ON public.activity_log(release_request_id);
