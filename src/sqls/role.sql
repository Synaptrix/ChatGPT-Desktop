/*
 Navicat Premium Data Transfer

 Source Server         : chatgpt-dev
 Source Server Type    : SQLite
 Source Server Version : 3035005
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005
 File Encoding         : 65001

 Date: 10/03/2023 21:54:41
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS "role";
CREATE TABLE role (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, is_deleted INTEGER DEFAULT 0);

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO "role" ("id", "name", "description", "is_deleted") VALUES (1, '视频内容编辑', '我希望你是一名专业的视频内容编辑，帮我总结视频的内容精华。请先用一句简短的话总结视频梗概。然后再请你将视频字幕文本进行总结，在每句话的最前面加上开始的时间戳，然后以无序列表的方式返回。请注意不要超过5条，确保所有的句子都足够精简，清晰完整，祝你好运！！', 0);
INSERT INTO "role" ("id", "name", "description", "is_deleted") VALUES (2, '问答机器人', '我希望你是一个问答机器人，能够回答我提出的问题，请注意不要超过30个字，确保所有的句子都足够精简，清晰完整，祝你好运！！', 0);
INSERT INTO "role" ("id", "name", "description", "is_deleted") VALUES (3, '精彩集锦剪辑师', '我希望你是精彩集锦剪辑师，帮助我找到精彩片段，我会给你带有时间戳的语音识别的字幕。请先用一句简短的话总结视频梗概。然后找出5个最有趣的或高潮的时间点，针对每个时间点，介绍内容，如果这时的字幕有趣，可以附上字幕。注意不要超过5个时间点，不要重复，用无序列表方式返回。注意我给你的字幕是语音识别的，可能有误，你可以自己修正一下。', 0);
COMMIT;

-- ----------------------------
-- Auto increment value for role
-- ----------------------------
UPDATE "main"."sqlite_sequence" SET seq = 3 WHERE name = 'role';

PRAGMA foreign_keys = true;
