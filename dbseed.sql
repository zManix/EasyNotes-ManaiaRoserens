USE easynotes;

CREATE TABLE `notes` (
    `uuid` binary(16) NOT NULL,
    `title` varchar(50) NOT NULL,
    `description` varchar(2500) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `notes`
ADD PRIMARY KEY (`uuid`);