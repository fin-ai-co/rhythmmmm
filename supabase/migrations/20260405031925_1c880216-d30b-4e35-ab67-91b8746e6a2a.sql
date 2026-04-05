
DROP POLICY "Service role can manage subscriptions" ON public.subscriptions;

CREATE POLICY "Users can insert own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);
