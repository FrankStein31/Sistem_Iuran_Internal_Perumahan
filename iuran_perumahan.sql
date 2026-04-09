/*
SQLyog Enterprise
MySQL - 8.0.30 : Database - iuran_perumahan
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`iuran_perumahan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `iuran_perumahan`;

/*Table structure for table `cache` */

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache` */

/*Table structure for table `cache_locks` */

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache_locks` */

/*Table structure for table `expenses` */

CREATE TABLE `expenses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `deskripsi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(12,2) NOT NULL,
  `kategori` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'umum',
  `bukti` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `expenses` */

insert  into `expenses`(`id`,`tanggal`,`deskripsi`,`jumlah`,`kategori`,`bukti`,`catatan`,`created_at`,`updated_at`) values 
(1,'2026-02-10','Token listrik pos satpam',150000.00,'listrik',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(2,'2026-02-15','Perbaikan selokan depan',500000.00,'perbaikan_selokan',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(3,'2026-03-05','Gaji satpam bulan lalu',1500000.00,'gaji_satpam',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(4,'2026-03-10','Token listrik pos satpam',150000.00,'listrik',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(5,'2026-03-20','Cat pagar perumahan',300000.00,'umum',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(6,'2026-04-05','Gaji satpam bulan ini',1500000.00,'gaji_satpam',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(7,'2026-04-08','Token listrik pos satpam',150000.00,'listrik',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(8,'2026-04-12','Perbaikan jalan retak',750000.00,'perbaikan_jalan',NULL,NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11');

/*Table structure for table `failed_jobs` */

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `failed_jobs` */

/*Table structure for table `house_residents` */

CREATE TABLE `house_residents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `house_id` bigint unsigned NOT NULL,
  `resident_id` bigint unsigned NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house_residents_house_id_foreign` (`house_id`),
  KEY `house_residents_resident_id_foreign` (`resident_id`),
  CONSTRAINT `house_residents_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `house_residents_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `house_residents` */

insert  into `house_residents`(`id`,`house_id`,`resident_id`,`tanggal_masuk`,`tanggal_keluar`,`is_active`,`catatan`,`created_at`,`updated_at`) values 
(1,1,1,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(2,2,2,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(3,3,3,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(4,4,4,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(5,5,5,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(6,6,6,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(7,7,7,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(8,8,8,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(9,9,9,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(10,10,10,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(11,11,11,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(12,12,12,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(13,13,13,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(14,14,14,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(15,15,15,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(16,16,16,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(17,17,17,'2025-10-01',NULL,1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10');

/*Table structure for table `houses` */

CREATE TABLE `houses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nomor_rumah` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_hunian` enum('dihuni','tidak_dihuni') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tidak_dihuni',
  `current_resident_id` bigint unsigned DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `houses_nomor_rumah_unique` (`nomor_rumah`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `houses` */

insert  into `houses`(`id`,`nomor_rumah`,`alamat`,`status_hunian`,`current_resident_id`,`keterangan`,`created_at`,`updated_at`) values 
(1,'1','Jl. Perumahan Elite Blok A No. 1','dihuni',1,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(2,'2','Jl. Perumahan Elite Blok A No. 2','dihuni',2,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(3,'3','Jl. Perumahan Elite Blok A No. 3','dihuni',3,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(4,'4','Jl. Perumahan Elite Blok A No. 4','dihuni',4,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(5,'5','Jl. Perumahan Elite Blok A No. 5','dihuni',5,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(6,'6','Jl. Perumahan Elite Blok A No. 6','dihuni',6,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(7,'7','Jl. Perumahan Elite Blok A No. 7','dihuni',7,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(8,'8','Jl. Perumahan Elite Blok A No. 8','dihuni',8,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(9,'9','Jl. Perumahan Elite Blok A No. 9','dihuni',9,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(10,'10','Jl. Perumahan Elite Blok A No. 10','dihuni',10,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(11,'11','Jl. Perumahan Elite Blok A No. 11','dihuni',11,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(12,'12','Jl. Perumahan Elite Blok A No. 12','dihuni',12,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(13,'13','Jl. Perumahan Elite Blok A No. 13','dihuni',13,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(14,'14','Jl. Perumahan Elite Blok A No. 14','dihuni',14,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(15,'15','Jl. Perumahan Elite Blok A No. 15','dihuni',15,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(16,'16','Jl. Perumahan Elite Blok A No. 16','dihuni',16,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(17,'17','Jl. Perumahan Elite Blok A No. 17','dihuni',17,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(18,'18','Jl. Perumahan Elite Blok A No. 18','tidak_dihuni',NULL,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(19,'19','Jl. Perumahan Elite Blok A No. 19','tidak_dihuni',NULL,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(20,'20','Jl. Perumahan Elite Blok A No. 20','tidak_dihuni',NULL,NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10');

/*Table structure for table `job_batches` */

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `job_batches` */

/*Table structure for table `jobs` */

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `jobs` */

/*Table structure for table `migrations` */

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `migrations` */

insert  into `migrations`(`id`,`migration`,`batch`) values 
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2024_01_01_000010_create_residents_table',1),
(5,'2024_01_01_000011_create_houses_table',1),
(6,'2024_01_01_000012_create_house_residents_table',1),
(7,'2024_01_01_000013_create_payments_table',1),
(8,'2024_01_01_000014_create_expenses_table',1),
(9,'2026_04_09_080544_create_personal_access_tokens_table',1);

/*Table structure for table `password_reset_tokens` */

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `password_reset_tokens` */

/*Table structure for table `payments` */

CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `house_id` bigint unsigned NOT NULL,
  `resident_id` bigint unsigned DEFAULT NULL,
  `jenis_iuran` enum('satpam','kebersihan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bulan` tinyint NOT NULL,
  `tahun` year NOT NULL,
  `jumlah` decimal(12,2) NOT NULL,
  `status` enum('paid','unpaid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `tanggal_bayar` date DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_payment` (`house_id`,`jenis_iuran`,`bulan`,`tahun`),
  KEY `payments_resident_id_foreign` (`resident_id`),
  CONSTRAINT `payments_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `payments` */

insert  into `payments`(`id`,`house_id`,`resident_id`,`jenis_iuran`,`bulan`,`tahun`,`jumlah`,`status`,`tanggal_bayar`,`catatan`,`created_at`,`updated_at`) values 
(1,1,1,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(2,1,1,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(3,2,2,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(4,2,2,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(5,3,3,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10'),
(6,3,3,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(7,4,4,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(8,4,4,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(9,5,5,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(10,5,5,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(11,6,6,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(12,6,6,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(13,7,7,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(14,7,7,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(15,8,8,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(16,8,8,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(17,9,9,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(18,9,9,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(19,10,10,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(20,10,10,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(21,11,11,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(22,11,11,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(23,12,12,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(24,12,12,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(25,13,13,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(26,13,13,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(27,14,14,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(28,14,14,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(29,15,15,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(30,15,15,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(31,16,16,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(32,16,16,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(33,17,17,'satpam',2,2026,100000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(34,17,17,'kebersihan',2,2026,15000.00,'paid','2026-02-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(35,1,1,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(36,1,1,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(37,2,2,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(38,2,2,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(39,3,3,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(40,3,3,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(41,4,4,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(42,4,4,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(43,5,5,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(44,5,5,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(45,6,6,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(46,6,6,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(47,7,7,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(48,7,7,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(49,8,8,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(50,8,8,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(51,9,9,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(52,9,9,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(53,10,10,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(54,10,10,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(55,11,11,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(56,11,11,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(57,12,12,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(58,12,12,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(59,13,13,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(60,13,13,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(61,14,14,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(62,14,14,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(63,15,15,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(64,15,15,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(65,16,16,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(66,16,16,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(67,17,17,'satpam',3,2026,100000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(68,17,17,'kebersihan',3,2026,15000.00,'paid','2026-03-05',NULL,'2026-04-09 08:31:11','2026-04-09 08:31:11'),
(69,1,1,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:42:38'),
(70,1,1,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:16'),
(71,2,2,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:42:46'),
(72,2,2,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:24'),
(73,3,3,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:00'),
(74,3,3,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:46:56'),
(75,4,4,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:24'),
(76,4,4,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:29'),
(77,5,5,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:31'),
(78,5,5,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:45:39'),
(79,6,6,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:42:49'),
(80,6,6,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:46:34'),
(81,7,7,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:27'),
(82,7,7,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:45:34'),
(83,8,8,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:20'),
(84,8,8,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:45:18'),
(85,9,9,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:42:42'),
(86,9,9,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:12'),
(87,10,10,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:43:38'),
(88,10,10,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:20'),
(89,11,11,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:03'),
(90,11,11,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:46:51'),
(91,12,12,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:07'),
(92,12,12,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:07'),
(93,13,13,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:12'),
(94,13,13,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:47:35'),
(95,14,14,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:22'),
(96,14,14,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:46:40'),
(97,15,15,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:27'),
(98,15,15,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:45:23'),
(99,16,16,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:44:32'),
(100,16,16,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:45:28'),
(101,17,17,'satpam',4,2026,100000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:46:45'),
(102,17,17,'kebersihan',4,2026,15000.00,'paid','2026-04-09',NULL,'2026-04-09 08:31:11','2026-04-09 08:42:55');

/*Table structure for table `personal_access_tokens` */

CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `personal_access_tokens` */

insert  into `personal_access_tokens`(`id`,`tokenable_type`,`tokenable_id`,`name`,`token`,`abilities`,`last_used_at`,`expires_at`,`created_at`,`updated_at`) values 
(1,'App\\Models\\User',1,'auth_token','ea3a67de5b3533ef2b7335a9c846958a5bac823192ef30c365fdf71c11654ce9','[\"*\"]','2026-04-09 08:50:18',NULL,'2026-04-09 08:39:04','2026-04-09 08:50:18');

/*Table structure for table `residents` */

CREATE TABLE `residents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_ktp` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_ktp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_penghuni` enum('tetap','kontrak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tetap',
  `no_hp` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_nikah` enum('menikah','belum_menikah') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_menikah',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `residents_no_ktp_unique` (`no_ktp`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `residents` */

insert  into `residents`(`id`,`nama_lengkap`,`no_ktp`,`foto_ktp`,`status_penghuni`,`no_hp`,`status_nikah`,`catatan`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'Budi Santoso','3201010101010001',NULL,'tetap','081234567801','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(2,'Siti Rahayu','3201010101010002',NULL,'tetap','081234567802','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(3,'Ahmad Fauzi','3201010101010003',NULL,'tetap','081234567803','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(4,'Dewi Lestari','3201010101010004',NULL,'tetap','081234567804','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(5,'Hendra Gunawan','3201010101010005',NULL,'tetap','081234567805','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(6,'Ratna Sari','3201010101010006',NULL,'tetap','081234567806','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(7,'Doni Kurniawan','3201010101010007',NULL,'tetap','081234567807','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(8,'Yuli Handayani','3201010101010008',NULL,'tetap','081234567808','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(9,'Rudi Hermawan','3201010101010009',NULL,'tetap','081234567809','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(10,'Nia Puspita','3201010101010010',NULL,'tetap','081234567810','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(11,'Fajar Nugroho','3201010101010011',NULL,'tetap','081234567811','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(12,'Eka Wahyuni','3201010101010012',NULL,'tetap','081234567812','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(13,'Agus Prasetyo','3201010101010013',NULL,'tetap','081234567813','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(14,'Sri Mulyani','3201010101010014',NULL,'tetap','081234567814','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(15,'Bambang Wijaya','3201010101010015',NULL,'tetap','081234567815','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(16,'Rizki Maulana','3201010101010016',NULL,'kontrak','081234567816','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(17,'Anisa Putri','3201010101010017',NULL,'kontrak','081234567817','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(18,'Dian Permata','3201010101010018',NULL,'kontrak','081234567818','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(19,'Citra Melinda','3201010101010019',NULL,'kontrak','081234567819','belum_menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL),
(20,'Wahyu Setiawan','3201010101010020',NULL,'kontrak','081234567820','menikah',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10',NULL);

/*Table structure for table `sessions` */

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sessions` */

insert  into `sessions`(`id`,`user_id`,`ip_address`,`user_agent`,`payload`,`last_activity`) values 
('BzNmrgAXlAZZd2DYvO0R579qXBnIDXk7T2fVCIDX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJLS2lUR3NhQWQ2VE83c2tsNUp0RU8wYTBtZ245a2h0c0toclc4WTNIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1775724057);

/*Table structure for table `users` */

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`name`,`email`,`email_verified_at`,`password`,`remember_token`,`created_at`,`updated_at`) values 
(1,'Admin RT','admin@rt.com',NULL,'$2y$12$F5Km5oVtR9ZPPgCVyfRlwOHY79b1lRnMxetlxk1cKQNWM/Mjby8v2',NULL,'2026-04-09 08:31:10','2026-04-09 08:31:10');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
