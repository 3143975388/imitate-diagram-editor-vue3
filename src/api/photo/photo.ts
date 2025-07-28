import request from '@/utils/request';

// 新增图纸/manager/scadaPaperImage
export function addScadaPaperImage(data: any) {
  return request.post('/dev-api/manager/scadaPaperImage', data);
}

// 查询图纸/manager/scadaPaperImage/list
export function getScadaPaperImageList(params: any) {
  return request.get('/dev-api/manager/scadaPaperImage/list', { params });
}

// 删除图纸/manager/scadaPaperImage/{ids}
export function deleteScadaPaperImage(ids: string) {
  return request.delete(`/dev-api/manager/scadaPaperImage/${ids}`);
}

// 修改图纸/manager/scadaPaperImage
export function updateScadaPaperImage(data: any) {
  return request.put('/dev-api/manager/scadaPaperImage', data);
}

// 新增文件夹/manager/scadaDirectory
export function addScadaDirectory(data: any) {
  return request.post('/dev-api/manager/scadaDirectory', data);
}

// 删除文件夹/manager/scadaDirectory/{ids}
export function deleteScadaDirectory(ids: string) {
  return request.delete(`/dev-api/manager/scadaDirectory/${ids}`);
}

// 查询文件夹/manager/scadaDirectory/list
export function getScadaDirectory(params: any){
  return request.get('/dev-api/manager/scadaDirectory/list', { params });
}

//上传文件/file/upload
export function uploadFile(data: any) {
  return request.post('/dev-api/file/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 新增图片、组件/manager/scadaImage
export function addScadaImage(data: any) {
  return request.post('/dev-api/manager/scadaImage', data);
}

// 查询图片、组件/manager/scadaImage/list
export function getScadaImageList(params: any) {
  return request.get('/dev-api/manager/scadaImage/list', { params });
}

// 删除图片/manager/scadaImage/{ids}
export function deleteScadaImage(ids: string){
  return request.delete(`/dev-api/manager/scadaImage/${ids}`)
}

// 获取用户详细信息
export function getInfo() {
  return request.get('/dev-api/system/user/getInfo');
}