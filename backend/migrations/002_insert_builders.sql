INSERT INTO builders (name, slug, website_url) VALUES
('D.R. Horton', 'dr-horton', 'https://www.drhorton.com'),
('Lennar', 'lennar', 'https://www.lennar.com'),
('M/I Homes', 'mi-homes', 'https://www.mihomes.com'),
('PulteGroup', 'pulte', 'https://www.pultgroup.com'),
('KB Home', 'kb-home', 'https://www.kbhome.com'),
('Toll Brothers', 'toll-brothers', 'https://www.tollbrothers.com'),
('Beazer Homes', 'beazer', 'https://www.beazer.com'),
('Hovnanian', 'hovnanian', 'https://www.hovnanian.com'),
('Taylor Morrison', 'taylor-morrison', 'https://www.taylormorrison.com'),
('Century Communities', 'century-communities', 'https://www.centurycommunities.com')
ON CONFLICT DO NOTHING;
