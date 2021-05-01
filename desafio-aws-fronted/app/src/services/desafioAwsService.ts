import http from "../http-common";

class DesafioAwsService {

  upload(file:any) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    return http.get("/list",{
        params,
        headers: {
          "Content-type": "application/json",
          'Authorization': `${window.localStorage.getItem('accessToken')}`
        }
      });
  }

  requestInteration(email:any) {
    const params = {
      email: email
    };

    return http.get("/iteracoes",{
      params,
      headers: {
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
        'Authorization': `${window.localStorage.getItem('accessToken')}`,
      },
      
    });
  }
}

export default new DesafioAwsService();