/*
 Navicat Premium Data Transfer

 Source Server         : MariaDB-Server
 Source Server Type    : MariaDB
 Source Server Version : 100508
 Source Host           : localhost:3306
 Source Schema         : db_evpms

 Target Server Type    : MariaDB
 Target Server Version : 100508
 File Encoding         : 65001

 Date: 20/05/2021 15:50:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for employees_copy1
-- ----------------------------
DROP TABLE IF EXISTS `employees_copy1`;
CREATE TABLE `employees_copy1`  (
  `id` int(11) NOT NULL,
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
-- Records of employees_copy1
-- ----------------------------
INSERT INTO `employees_copy1` VALUES (1, 'LEA', 'CIUBAL', 'LAYASAN', '*', '*', '14633692942152142', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (2, 'JULIE ANN', 'BAGUNOC', 'CAYCONG', '*', '*', '14635398554634622', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (3, 'MYRA FE', 'L', 'DEGNADICE', '*', '*', '14635395122232222', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (4, 'LINA', 'GETIAYON', 'LAPASTORA', '*', '*', '14635494844294282', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (5, 'CARISSE DAWN', 'LAYASAN', 'ALCONES', '*', '*', '14633922929239222', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (6, 'NALYN', 'VALENZUELA', 'GOLEZ', '*', '*', '14633766933063052', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (7, 'JOVY', 'GALLEGO', 'BAUTISTA', '*', '*', '14632135204824812', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (8, 'STEPHEN', 'SALES', 'SEGUIBAN', '*', '*', '14632136665415402', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (11, 'CHRISTY', 'WALAN', 'JAMIAS', '*', '*', '14632149781231222', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (13, 'ARCHIE', 'J', 'PAHILGA', '*', '*', '14633693501751742', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (14, 'AILYN', 'ESPERIDION', 'PLANCO', '*', '*', '146321553400982', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (15, 'JULYN', 'J', 'SALMINGO', '*', '*', '1463369392083822', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (16, 'AUGIE', 'G', 'SAMINGO', '*', '*', '14633695517307292', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (17, 'RAFFY', 'G', 'ABACASIN', '*', '*', '14633695747387372', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (18, 'JOEBERT', 'H', 'CANTON', '*', '*', '14632163621851842', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (19, 'JAY', 'N', 'PALMA', '*', '*', '14632164568218202', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (20, 'VIVIAN', 'TAMONAN', 'SERVIGON', '*', '*', '14635647373423412', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (21, 'JANICE', 'GAGANTE', 'YULO', '*', '*', '1463216649078772', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (22, 'KRIZEL ANGELIE', 'CALUMNO', 'CABARON', '*', '*', '14632167811561552', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (23, 'MA. LUMIN', 'GURADA', 'CARO', '*', '*', '14634499815345332', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (24, 'EDISON', 'SARA', 'PALMES', '*', '*', '14632170744714702', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (25, 'REYNIEL', 'BAGONOC', 'CAYCONG', '*', '*', '14632186037427412', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (26, 'ROBETH', 'FELICIANO', 'ABANERO', '*', '*', '14635570406706692', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (27, 'ALFONSO', 'LADIONA', 'GULLO', '*', '*', '14635414766376362', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (28, 'MANUEL', 'AMANTE', 'MARTIZANO', '*', '*', '14635413748428412', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (29, 'WILLIAM', 'G', 'PADERNAL', '*', '*', '14633622182182172', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (30, 'POPEYE', 'B', 'ABAYGAR', '*', '*', '14633624379589572', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (31, 'ERNESTO', 'T', 'MASIBO', '*', '*', '14633634586876862', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (32, 'EDGAR', 'Y', 'PAHALAGA', '*', '*', '14633635603653642', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (33, 'JHONNEL', 'E', 'TORRE', '*', '*', '14633636445235222', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (34, 'GREG', 'H', 'MABUQUE', '*', '*', '14633699078098082', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (35, 'JOE', 'F', 'STA. RITA', '*', '*', '14633700001111102', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (36, 'NICKY', '*', '*', '*', '*', '14633702597977962', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (37, 'ARJEAN', '*', '*', '*', '*', '14633703424774762', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (38, 'ARGIE', '*', '*', '*', '*', '14633704164444432', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (39, 'ARMAN', '*', '*', '*', '*', '14633704976846832', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (40, 'JAMES', '*', '*', '*', '*', '14633707517217202', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (41, 'JOMAR', 'MASA', 'GOLEZ', '*', '*', '14633770587797782', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (42, 'JONELYN', 'CALA-OR', 'CALICO', '*', '*', '14633712519329312', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1042, 'DENMARK', 'CAUMBAN', 'CALASAGSAG', '*', '*', '14633769352012002', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1043, 'JOEBEL', '*', 'ABANERO', '*', '*', '14633783331651642', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1044, 'ROMIE', '*', 'BORROMEO', '*', '*', '14633784992642632', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1045, 'SWEDEN', '*', 'MARCIAL', '*', '*', '14633793423593582', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1046, 'LLOYD', 'CONDOLADA', 'LORETO', '*', '*', '14633795272312302', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1047, 'HENDRICKSON', '*', 'MARTE', '*', '*', '14633803753323312', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1048, 'RONNEL', '*', 'ABANERO', '*', '*', '14633812415985972', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1049, 'JOJO', 'BAYLON', 'FERRER', '*', '*', '14633828843103092', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1050, 'JOBERT', '*', 'PLANCO', '*', '*', '14633814948038022', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1051, 'ELLIE', '*', 'GERONAGA', '*', '*', '14635486816136122', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1052, 'JOBEN', '*', 'PACIENTE', '*', '*', '14633823163923912', 'Active', NULL, NULL);
INSERT INTO `employees_copy1` VALUES (1053, 'MELANIE', 'CALUMNO', 'CALA-OR', '*', '*', '14633824202362352', 'Active', NULL, NULL);

-- ----------------------------
-- Table structure for fingerprints_copy1
-- ----------------------------
DROP TABLE IF EXISTS `fingerprints_copy1`;
CREATE TABLE `fingerprints_copy1`  (
  `id` int(11) NOT NULL,
  `emp_id` int(11) NULL DEFAULT NULL,
  `finger_idx` int(1) NOT NULL,
  `data` longblob NULL,
  `image_data` longblob NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fingerprints_copy1
-- ----------------------------
INSERT INTO `fingerprints_copy1` VALUES (1, 1, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (2, 1, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (3, 1, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (4, 2, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (5, 2, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (6, 3, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (7, 3, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (8, 4, 0, NULL, NULL);
INSERT INTO `fingerprints_copy1` VALUES (9, 4, 0, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
