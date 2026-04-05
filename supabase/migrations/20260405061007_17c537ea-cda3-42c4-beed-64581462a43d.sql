-- Create a function to auto-create trial subscription on signup
CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, expires_at, product_id, platform)
  VALUES (NEW.id, 'trial', now() + interval '7 days', 'trial_7d', 'web')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on auth.users signup
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_trial_subscription();
