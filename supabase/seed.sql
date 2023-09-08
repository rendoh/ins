INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at) VALUES ('00000000-0000-0000-0000-000000000000', 'c5cc1542-ef98-441f-a338-89f22b381f2a', 'authenticated', 'authenticated', 'alice@example.com', '$2a$10$5UK1CUtUoQe.ByselF4VJexxPcrb8kszuW9shOmURN/jafQcx8GqC', '2023-09-07 05:48:08.208963+00', NULL, '', '2023-09-07 05:47:59.238637+00', '', NULL, '', '', NULL, '2023-09-07 05:48:13.958649+00', '{"provider": "email", "providers": ["email"]}', '{"username": "alice"}', NULL, '2023-09-07 05:47:59.233226+00', '2023-09-07 05:48:13.960003+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at) VALUES ('00000000-0000-0000-0000-000000000000', '525011a0-5c18-4075-b625-3972f16102e8', 'authenticated', 'authenticated', 'bob@example.com', '$2a$10$CAXk/q6B3wtfbc6yqJeazOutaYSBeQSIEAG8jDhyVH8dMqQ4X2nEa', '2023-09-07 05:49:00.75271+00', NULL, '', '2023-09-07 05:48:50.054665+00', '', NULL, '', '', NULL, '2023-09-07 05:49:00.865424+00', '{"provider": "email", "providers": ["email"]}', '{"username": "bob"}', NULL, '2023-09-07 05:48:50.050698+00', '2023-09-07 05:49:00.869097+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at) VALUES ('00000000-0000-0000-0000-000000000000', '06e20dc1-ac3a-4176-819e-5ef232f7ebdc', 'authenticated', 'authenticated', 'carol@example.com', '$2a$10$wb67WckWKpQshQyNMpVnl.ohWZOiGsIFFw5jKzIc9pWkEoFz9z6qS', '2023-09-07 05:50:07.868602+00', NULL, '', '2023-09-07 05:50:02.458874+00', '', NULL, '', '', NULL, '2023-09-07 05:50:07.929539+00', '{"provider": "email", "providers": ["email"]}', '{"username": "carol"}', NULL, '2023-09-07 05:50:02.456127+00', '2023-09-07 05:50:07.931157+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES ('c5cc1542-ef98-441f-a338-89f22b381f2a', 'c5cc1542-ef98-441f-a338-89f22b381f2a', '{"sub": "c5cc1542-ef98-441f-a338-89f22b381f2a", "email": "alice@example.com"}', 'email', '2023-09-07 05:47:59.23678+00', '2023-09-07 05:47:59.236798+00', '2023-09-07 05:47:59.236798+00');
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES ('525011a0-5c18-4075-b625-3972f16102e8', '525011a0-5c18-4075-b625-3972f16102e8', '{"sub": "525011a0-5c18-4075-b625-3972f16102e8", "email": "bob@example.com"}', 'email', '2023-09-07 05:48:50.053526+00', '2023-09-07 05:48:50.053541+00', '2023-09-07 05:48:50.053541+00');
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES ('06e20dc1-ac3a-4176-819e-5ef232f7ebdc', '06e20dc1-ac3a-4176-819e-5ef232f7ebdc', '{"sub": "06e20dc1-ac3a-4176-819e-5ef232f7ebdc", "email": "carol@example.com"}', 'email', '2023-09-07 05:50:02.45764+00', '2023-09-07 05:50:02.457656+00', '2023-09-07 05:50:02.457656+00');