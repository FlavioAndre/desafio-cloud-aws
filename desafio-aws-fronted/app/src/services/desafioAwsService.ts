import http from "../http-common";

class DesafioAwsService {

  upload(file:any) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Authorization': `${window.localStorage.getItem('accessToken')}`,
      },
    });
  }

  download(file:any) {
    const params = {
      fileName: file
    };

    return http.get("/download",{
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Authorization': `${window.localStorage.getItem('accessToken')}`,
      },
      responseType: 'arraybuffer', 
      params
    });
  }

  getFiles(nextContinuationToken: any) {
    const params = {
      nextContinuationToken: nextContinuationToken
    };
    return http.get("/listAll",{
        headers: {
          "Content-type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Authorization', 
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Authorization': `${window.localStorage.getItem('accessToken')}`
        },
        params
      });
  }

  requestInteration(email:any) {
    const params = {
      email: email
    };

    return http.get("/iteracoes",{
      params,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Authorization': `${window.localStorage.getItem('accessToken')}`,
      },
      
    });
  }

  deleteFile(file:any) {
    const params = {
      fileName: file
    };

    return http.delete("/delete",{
      params,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Authorization': `${window.localStorage.getItem('accessToken')}`,
      },
      
    });
  }
}

export default new DesafioAwsService();