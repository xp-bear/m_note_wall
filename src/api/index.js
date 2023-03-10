//引入axios
import service from "@/utils/axios";

// 获取用户ip
export const signIpApi = () => service.get("/signip");

// 新建wall留言
export const insertWallApi = (data) => service.post("/insertwall", data);

//查询留言墙
export const findWallPageApi = (data) => service.post("/findwallpage", data);

// 查询留言墙或照片墙的总条数。
export const findWallPhotoTotalApi = (data) => service.post("/findwallphotototal", data);

// 新增反馈与喜欢
export const insertFeedBackApi = (data) => service.post("/insertfeedback", data);

// 新增评论
export const insertCommentApi = (data) => service.post("/insertcomment", data);

// 查询评论
export const findCommentPageApi = (data) => service.post("/findcommentpage", data);

// 上传图片
export const profileApi = (data) => service.post("/profile", data);

// 是否点击爱心
export const likeCountApi = (data) => service.post("/likecount", data);

//删除留言
export const deleteWallApi = (data) => service.post("/deletewall", data);

// 删除相关图片或者视频资源。
export const deletePhotoApi = (data) => service.post("/deletephoto", data);
