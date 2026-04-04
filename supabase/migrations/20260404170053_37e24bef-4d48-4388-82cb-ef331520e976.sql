-- Remove dummy offer
DELETE FROM offers WHERE title = '1';

-- Insert 4 real offers
INSERT INTO offers (title, title_bn, description, description_bn, type, active, image_url) VALUES
(
  'Make a Referral and Earn BDT 500!',
  'রেফার করুন এবং ৫০০ টাকা জিতুন!',
  'Refer & Earn for all existing customers of Galaxy Net. If any existing customer of Galaxy Net makes a new referral and the referred person takes a new connection, the existing customer will earn BDT 500 as a reward.',
  'Galaxy Net এর সকল বিদ্যমান গ্রাহকদের জন্য রেফার অ্যান্ড আর্ন প্রোগ্রাম। Galaxy Net এর কোনো বিদ্যমান গ্রাহক নতুন রেফারেল করলে এবং রেফার করা ব্যক্তি নতুন সংযোগ নিলে, বিদ্যমান গ্রাহক পুরস্কার হিসেবে ৫০০ টাকা পাবেন।',
  'referral',
  true,
  NULL
),
(
  '500 BDT Discount on Connection Charge',
  'কানেকশন চার্জে ৫০০ টাকা ছাড়',
  'You can enjoy BDT 500 Discount on your connection fee when you will make a payment of 2 months in Advance with Galaxy Net.',
  '২ মাসের বিল অগ্রিম পরিশোধ করলে Galaxy Net এর কানেকশন চার্জে ৫০০ টাকা ছাড় পাবেন।',
  'offer',
  true,
  NULL
),
(
  'Free Connection Charge on 4 Months Advance Payment',
  '৪ মাসের অগ্রিম পেমেন্টে ফ্রি কানেকশন চার্জ',
  'Now enjoy a free connection charge with Galaxy Net when you will make an advance payment of 4 months together.',
  '৪ মাসের বিল একসাথে অগ্রিম পরিশোধ করলে Galaxy Net এর কানেকশন চার্জ সম্পূর্ণ ফ্রি!',
  'offer',
  true,
  NULL
),
(
  '1000 BDT Discount on Connection Charge',
  'কানেকশন চার্জে ১,০০০ টাকা ছাড়',
  'You can enjoy BDT 1000 Discount on your connection fee when you will make a payment of 3 months in Advance with Galaxy Net.',
  '৩ মাসের বিল অগ্রিম পরিশোধ করলে Galaxy Net এর কানেকশন চার্জে ১,০০০ টাকা ছাড় পাবেন।',
  'offer',
  true,
  NULL
);
