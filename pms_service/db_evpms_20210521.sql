/*
 Navicat Premium Data Transfer

 Source Server         : WAMPSERVER-Mariadb
 Source Server Type    : MariaDB
 Source Server Version : 100208
 Source Host           : localhost:3307
 Source Schema         : db_evpms

 Target Server Type    : MariaDB
 Target Server Version : 100208
 File Encoding         : 65001

 Date: 21/05/2021 22:10:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for daily_time_logs
-- ----------------------------
DROP TABLE IF EXISTS `daily_time_logs`;
CREATE TABLE `daily_time_logs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Fixed;

-- ----------------------------
-- Table structure for daily_time_records
-- ----------------------------
DROP TABLE IF EXISTS `daily_time_records`;
CREATE TABLE `daily_time_records`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Fixed;

-- ----------------------------
-- Table structure for employee_dependents
-- ----------------------------
DROP TABLE IF EXISTS `employee_dependents`;
CREATE TABLE `employee_dependents`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emp_id` int(11) NULL DEFAULT NULL,
  `child_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of employee_dependents
-- ----------------------------
INSERT INTO `employee_dependents` VALUES (1, 1, 'Jane Doe');
INSERT INTO `employee_dependents` VALUES (2, 1, 'John Doe');
INSERT INTO `employee_dependents` VALUES (3, 1, 'Peter Parker');

-- ----------------------------
-- Table structure for employee_details
-- ----------------------------
DROP TABLE IF EXISTS `employee_details`;
CREATE TABLE `employee_details`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emp_id` int(11) NULL DEFAULT NULL,
  `dob` datetime(0) NULL DEFAULT NULL,
  `gender` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `civil_status` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of employee_details
-- ----------------------------
INSERT INTO `employee_details` VALUES (1, 1, '2021-05-17 18:46:11', 'female', 'single');

-- ----------------------------
-- Table structure for employee_payslips
-- ----------------------------
DROP TABLE IF EXISTS `employee_payslips`;
CREATE TABLE `employee_payslips`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emp_id` int(11) NULL DEFAULT NULL,
  `gross_pay` decimal(18, 0) NOT NULL,
  `net_pay` decimal(18, 0) NOT NULL,
  `total_deductions` decimal(18, 0) NOT NULL,
  `date` datetime(0) NOT NULL,
  `employee_payroll_id` int(11) NOT NULL,
  `employee_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IX_FK_EmployeePayrollEmpPaySlip`(`employee_payroll_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Fixed;

-- ----------------------------
-- Table structure for employees
-- ----------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees`  (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NULL DEFAULT NULL,
  `first_name` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `middle_name` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_name` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `password` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `id_no` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_data` longblob NULL,
  `tmp_photo` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of employees
-- ----------------------------
INSERT INTO `employees` VALUES (1, 1, 'LEA', 'CIUBAL', 'LAYASAN', '*', '*', '14633692942152142', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (2, 2, 'JULIE ANN', 'BAGUNOC', 'CAYCONG', '*', '*', '14635398554634622', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (3, 3, 'MYRA FE', 'L', 'DEGNADICE', '*', '*', '14635395122232222', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (4, NULL, 'LINA', 'GETIAYON', 'LAPASTORA', '*', '*', '14635494844294282', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (5, NULL, 'CARISSE DAWN', 'LAYASAN', 'ALCONES', '*', '*', '14633922929239222', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (6, NULL, 'NALYN', 'VALENZUELA', 'GOLEZ', '*', '*', '14633766933063052', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (7, NULL, 'JOVY', 'GALLEGO', 'BAUTISTA', '*', '*', '14632135204824812', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (8, NULL, 'STEPHEN', 'SALES', 'SEGUIBAN', '*', '*', '14632136665415402', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (11, NULL, 'CHRISTY', 'WALAN', 'JAMIAS', '*', '*', '14632149781231222', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (13, NULL, 'ARCHIE', 'J', 'PAHILGA', '*', '*', '14633693501751742', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (14, NULL, 'AILYN', 'ESPERIDION', 'PLANCO', '*', '*', '146321553400982', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (15, NULL, 'JULYN', 'J', 'SALMINGO', '*', '*', '1463369392083822', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (16, NULL, 'AUGIE', 'G', 'SAMINGO', '*', '*', '14633695517307292', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (17, NULL, 'RAFFY', 'G', 'ABACASIN', '*', '*', '14633695747387372', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (18, NULL, 'JOEBERT', 'H', 'CANTON', '*', '*', '14632163621851842', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (19, NULL, 'JAY', 'N', 'PALMA', '*', '*', '14632164568218202', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (20, NULL, 'VIVIAN', 'TAMONAN', 'SERVIGON', '*', '*', '14635647373423412', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (21, NULL, 'JANICE', 'GAGANTE', 'YULO', '*', '*', '1463216649078772', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (22, NULL, 'KRIZEL ANGELIE', 'CALUMNO', 'CABARON', '*', '*', '14632167811561552', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (23, NULL, 'MA. LUMIN', 'GURADA', 'CARO', '*', '*', '14634499815345332', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (24, NULL, 'EDISON', 'SARA', 'PALMES', '*', '*', '14632170744714702', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (25, NULL, 'REYNIEL', 'BAGONOC', 'CAYCONG', '*', '*', '14632186037427412', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (26, NULL, 'ROBETH', 'FELICIANO', 'ABANERO', '*', '*', '14635570406706692', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (27, NULL, 'ALFONSO', 'LADIONA', 'GULLO', '*', '*', '14635414766376362', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (28, NULL, 'MANUEL', 'AMANTE', 'MARTIZANO', '*', '*', '14635413748428412', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (29, NULL, 'WILLIAM', 'G', 'PADERNAL', '*', '*', '14633622182182172', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (30, NULL, 'POPEYE', 'B', 'ABAYGAR', '*', '*', '14633624379589572', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (31, NULL, 'ERNESTO', 'T', 'MASIBO', '*', '*', '14633634586876862', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (32, NULL, 'EDGAR', 'Y', 'PAHALAGA', '*', '*', '14633635603653642', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (33, NULL, 'JHONNEL', 'E', 'TORRE', '*', '*', '14633636445235222', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (34, NULL, 'GREG', 'H', 'MABUQUE', '*', '*', '14633699078098082', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (35, NULL, 'JOE', 'F', 'STA. RITA', '*', '*', '14633700001111102', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (36, NULL, 'NICKY', '*', '*', '*', '*', '14633702597977962', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (37, NULL, 'ARJEAN', '*', '*', '*', '*', '14633703424774762', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (38, NULL, 'ARGIE', '*', '*', '*', '*', '14633704164444432', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (39, NULL, 'ARMAN', '*', '*', '*', '*', '14633704976846832', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (40, NULL, 'JAMES', '*', '*', '*', '*', '14633707517217202', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (41, NULL, 'JOMAR', 'MASA', 'GOLEZ', '*', '*', '14633770587797782', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (42, NULL, 'JONELYN', 'CALA-OR', 'CALICO', '*', '*', '14633712519329312', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1042, NULL, 'DENMARK', 'CAUMBAN', 'CALASAGSAG', '*', '*', '14633769352012002', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1043, NULL, 'JOEBEL', '*', 'ABANERO', '*', '*', '14633783331651642', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1044, NULL, 'ROMIE', '*', 'BORROMEO', '*', '*', '14633784992642632', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1045, NULL, 'SWEDEN', '*', 'MARCIAL', '*', '*', '14633793423593582', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1046, NULL, 'LLOYD', 'CONDOLADA', 'LORETO', '*', '*', '14633795272312302', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1047, NULL, 'HENDRICKSON', '*', 'MARTE', '*', '*', '14633803753323312', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1048, NULL, 'RONNEL', '*', 'ABANERO', '*', '*', '14633812415985972', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1049, NULL, 'JOJO', 'BAYLON', 'FERRER', '*', '*', '14633828843103092', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1050, NULL, 'JOBERT', '*', 'PLANCO', '*', '*', '14633814948038022', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1051, NULL, 'ELLIE', '*', 'GERONAGA', '*', '*', '14635486816136122', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1052, NULL, 'JOBEN', '*', 'PACIENTE', '*', '*', '14633823163923912', 'Active', NULL, NULL);
INSERT INTO `employees` VALUES (1053, NULL, 'MELANIE', 'CALUMNO', 'CALA-OR', '*', '*', '14633824202362352', 'Active', NULL, NULL);

-- ----------------------------
-- Table structure for employment_infos
-- ----------------------------
DROP TABLE IF EXISTS `employment_infos`;
CREATE TABLE `employment_infos`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `emp_id` int(11) NULL DEFAULT NULL,
  `DateEmployed` datetime(0) NULL DEFAULT NULL,
  `IsRegular` tinyint(4) NULL DEFAULT NULL,
  `SSSNo` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `PhilHealthNo` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `Designation` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `DailyRate` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `PAGIBIGNo` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `TIN` longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `SSSDeduction` decimal(18, 0) NULL DEFAULT NULL,
  `PHDeduction` decimal(18, 0) NULL DEFAULT NULL,
  `PAGIBIGDeduction` decimal(18, 0) NULL DEFAULT NULL,
  `TaxDeduction` decimal(18, 0) NULL DEFAULT NULL,
  `EmployeeEmploymentInfo_EmploymentInfo_Id` int(11) NULL DEFAULT NULL,
  `DeductionRate` decimal(18, 2) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FK_EmployeeEmploymentInfo`(`EmployeeEmploymentInfo_EmploymentInfo_Id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for fingerprints
-- ----------------------------
DROP TABLE IF EXISTS `fingerprints`;
CREATE TABLE `fingerprints`  (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NULL DEFAULT NULL,
  `finger_idx` int(1) NOT NULL,
  `data` longblob NULL,
  `image_data` longblob NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fingerprints
-- ----------------------------
INSERT INTO `fingerprints` VALUES (1, 1, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (2, 1, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (3, 1, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (4, 2, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (5, 2, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (6, 3, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (7, 3, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (8, 4, 0, NULL, NULL);
INSERT INTO `fingerprints` VALUES (9, 4, 0, NULL, NULL);

-- ----------------------------
-- Table structure for loans
-- ----------------------------
DROP TABLE IF EXISTS `loans`;
CREATE TABLE `loans`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` datetime(0) NOT NULL,
  `Amount` decimal(18, 0) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `DeductionAmount` decimal(18, 0) NOT NULL,
  `IsFullyPaid` tinyint(4) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_FK_EmployeeLoan`(`EmployeeId`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Fixed;

SET FOREIGN_KEY_CHECKS = 1;
