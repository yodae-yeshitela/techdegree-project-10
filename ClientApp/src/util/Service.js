import btoa from 'btoa'
import config from './config'

async function api(path, method= "Get", body = null, requiresAuth=false, credentials=null) {

     const url = config.apiBaseUrl + path;

     const options = {
          method,
          headers: {
               'Content-Type': 'application/json; charset=utf-8'
          }
     }

     if(body){
          options.body = JSON.stringify(body);
     }

     if(requiresAuth){
          const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`)
          options.headers['Authorization'] = `Basic ${encodedCredentials}`
     }

      
     return fetch( url, options );
}

const extractData = async(result) => {
     if (result.status === 200){
          return  await result.json();
         
     }
     else if( result.status === 401){
          return null;
     }
     else throw new Error();
}

async function getUser(username='joe@smith.com', password='joepassword') {
    const result = await api('/users', 'Get', null, true, {username, password});
    return await extractData(result)
    
}

async function getCourses(){
     const result = await api('/courses', 'Get');
     return await extractData(result);
}

async function getCourseById(id){
     const result = await api(`/courses/${id}`, 'Get');
     return await extractData(result);
}

async function createUser(data) {
     const result = await api('/users', 'post', data);
     if(result.status === 201){
          return null;
     }
     else if( result.status === 409 || result.status === 400){
          return await result.json();
     }
     else throw new Error();
}
async function createCourse(data, credentials) {
     const result = await api('/courses', 'post', data, true, credentials);
     if(result.status === 201){
          console.log(result);
          return {location: result.headers};
          
     }
     else if( result.status === 400){
          return {errors: await result.json()};
     }
     else throw new Error();
}

async function updateCourse(id,data, credentials) {
     const result = await api(`/courses/${id}`, 'put', data, true, credentials);
     if(result.status === 204){
          console.log(result);
          return {location: result.headers};
          
     }
     else if( result.status === 400){
          return {errors: await result.json()};
     }
     else throw new Error();
}
async function deleteCourse(id, credentials) {
     const result = await api('/courses/' + id, 'delete', null, true, credentials);
     if(result.status === 204){
          return null;
     }
     else if( result.status === 403 || result.status === 400){
          return {status: result.status, ...await result.json()};
     }
     else throw new Error();
}


export default {
     getUser,
     getCourses,
     createUser,
     getCourseById,
     createCourse,
     deleteCourse,
     updateCourse
};

 