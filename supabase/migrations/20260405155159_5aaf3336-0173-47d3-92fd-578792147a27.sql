CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
FOR DELETE TO authenticated
USING (auth.uid() = user_id);