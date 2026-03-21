
-- Nullify FK references in connection_orders
UPDATE connection_orders SET package_id = NULL WHERE package_id IS NOT NULL;

-- Delete existing packages
DELETE FROM packages;

-- Insert Home packages
INSERT INTO packages (name, name_bn, speed, price, category, sort_order, visible, featured, features, badges) VALUES
('Starter+', 'স্টার্টার+', 20, 500, 'home', 1, true, false, '["20 Mbps Speed", "Unlimited Data", "24/7 Support"]'::jsonb, '["BDIX", "FTP"]'::jsonb),
('Basic+', 'বেসিক+', 25, 525, 'home', 2, true, false, '["25 Mbps Speed", "Unlimited Data", "24/7 Support"]'::jsonb, '["BDIX", "FTP"]'::jsonb),
('Advance+', 'অ্যাডভান্স+', 40, 650, 'home', 3, true, false, '["40 Mbps Speed", "Unlimited Data", "24/7 Support"]'::jsonb, '["BDIX", "FTP"]'::jsonb),
('Super+', 'সুপার+', 50, 750, 'home', 4, true, true, '["50 Mbps Speed", "Unlimited Data", "24/7 Support", "Gaming Optimized"]'::jsonb, '["BDIX", "FTP", "Cache"]'::jsonb),
('Power+', 'পাওয়ার+', 60, 850, 'home', 5, true, false, '["60 Mbps Speed", "Unlimited Data", "24/7 Support"]'::jsonb, '["BDIX", "FTP", "Cache"]'::jsonb),
('Ultra+', 'আল্ট্রা+', 80, 1050, 'home', 6, true, false, '["80 Mbps Speed", "Unlimited Data", "24/7 Support", "HD Streaming"]'::jsonb, '["BDIX", "FTP", "Cache"]'::jsonb),
('Gaming+', 'গেমিং+', 100, 1260, 'home', 7, true, true, '["100 Mbps Speed", "Unlimited Data", "24/7 Support", "Low Latency Gaming"]'::jsonb, '["BDIX", "FTP", "Cache", "Dedicated"]'::jsonb),
('Turbo+', 'টার্বো+', 150, 1575, 'home', 8, true, false, '["150 Mbps Speed", "Unlimited Data", "24/7 Support", "4K Streaming"]'::jsonb, '["BDIX", "FTP", "Cache", "Dedicated"]'::jsonb),
('Elite+', 'এলিট+', 200, 2100, 'home', 9, true, false, '["200 Mbps Speed", "Unlimited Data", "Priority Support", "4K Streaming"]'::jsonb, '["BDIX", "FTP", "Cache", "Dedicated"]'::jsonb),
('Titan+', 'টাইটান+', 250, 3150, 'home', 10, true, false, '["250 Mbps Speed", "Unlimited Data", "Priority Support", "Ultra HD Streaming"]'::jsonb, '["BDIX", "FTP", "Cache", "Dedicated"]'::jsonb);

-- Insert Corporate packages
INSERT INTO packages (name, name_bn, speed, price, category, sort_order, visible, featured, features, badges) VALUES
('Startup+', 'স্টার্টআপ+', 30, 2500, 'corporate', 1, true, false, '["30 Mbps Speed", "Unlimited Data", "24/7 Support", "Static IP"]'::jsonb, '["BDIX", "FTP", "Dedicated"]'::jsonb),
('Business+', 'বিজনেস+', 45, 3500, 'corporate', 2, true, true, '["45 Mbps Speed", "Unlimited Data", "Priority Support", "Static IP"]'::jsonb, '["BDIX", "FTP", "Dedicated"]'::jsonb),
('Enterprise+', 'এন্টারপ্রাইজ+', 60, 4500, 'corporate', 3, true, false, '["60 Mbps Speed", "Unlimited Data", "Priority Support", "Static IP", "SLA"]'::jsonb, '["BDIX", "FTP", "Dedicated"]'::jsonb),
('Corporate+', 'কর্পোরেট+', 75, 5500, 'corporate', 4, true, false, '["75 Mbps Speed", "Unlimited Data", "Dedicated Support", "Static IP", "SLA"]'::jsonb, '["BDIX", "FTP", "Dedicated"]'::jsonb),
('Premium+', 'প্রিমিয়াম+', 100, 7000, 'corporate', 5, true, false, '["100 Mbps Speed", "Unlimited Data", "Dedicated Support", "Static IP", "SLA", "99.9% Uptime"]'::jsonb, '["BDIX", "FTP", "Dedicated"]'::jsonb);

-- Insert Dedicated package
INSERT INTO packages (name, name_bn, speed, price, category, sort_order, visible, featured, features, badges) VALUES
('Dedicated Internet', 'ডেডিকেটেড ইন্টারনেট', 0, 0, 'dedicated', 1, true, false, '["Custom Bandwidth", "99.99% Uptime SLA", "Dedicated Support Manager", "Static IP Block", "24/7 NOC Monitoring"]'::jsonb, '["Dedicated"]'::jsonb);
