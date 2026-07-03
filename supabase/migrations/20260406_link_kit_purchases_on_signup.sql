-- When a new user profile is created, link any kit_purchases by matching email
CREATE OR REPLACE FUNCTION public.link_kit_purchases()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE kit_purchases
  SET user_id = NEW.id, updated_at = NOW()
  WHERE lower(customer_email) = lower(NEW.email)
    AND user_id IS NULL;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_profile_created_link_kit
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.link_kit_purchases();
