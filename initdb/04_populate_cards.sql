INSERT INTO cards
SELECT * FROM variants
WHERE
    (ext_rarity IN ('Common', 'Uncommon') AND sub_type_name = 'Normal')
    OR (ext_rarity IN ('Rare', 'Epic') AND sub_type_name = 'Foil')
    OR ext_rarity = 'Showcase';
