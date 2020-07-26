import btoa from 'btoa'
import config from './config'

//a function which makes the call to our api and returns a promise
//it is a general function in that it accepts calls to different routes and diffrent
//http methods
async function api(path, method= "Get", body = null, requiresAuth=false, credentials=null) {

     const url = config.apiBaseUrl + path;
     //options for the request
     const options = {
          method,
          headers: {
               'Content-Type': 'application/json; charset=utf-8'
          }
     }
     //if there's a body convert to json
     if(body){
          options.body = JSON.stringify(body);
     }
     //if the request needs authentication add the neccessary headers.
     if(requiresAuth){
          const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`)
          options.headers['Authorization'] = `Basic ${encodedCredentials}`
     }
      
     return fetch( url, options );
}
//a helper function to process the data from a promise
const extractData = async(result) => {
     if (result.status === 200){
          return  await result.json();
         
     }
     else if( result.status === 401){
          return null;
     }
     else throw new Error();
}
//a function to get user inorder to login to the app
async function getUser(username='joe@smith.com', password='joepassword') {
    const result = await api('/users', 'Get', null, true, {username, password});
    return await extractData(result)
    
}
//a function to get all courses in the database
async function getCourses(){
     const result = await api('/courses', 'Get');
     return await extractData(result);
}
//a function to get a course by id
async function getCourseById(id){
     const result = await api(`/courses/${id}`, 'Get');
     return await extractData(result);
}
//a function that calls the api to create a new user
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

//a function to create a course in the database using the api
async function createCourse(data, credentials) {
     const result = await api('/courses', 'post', data, true, credentials);
     if(result.status === 201){
          return await result.json();
     }
     else if( result.status === 400){
          return await result.json();
     }
     else throw new Error();
}
// update an existing course in the database
async function updateCourse(id,data, credentials) {
     const result = await api(`/courses/${id}`, 'put', data, true, credentials);
     if(result.status === 204){
          return null;
     }
     else if( result.status === 400){
          return {errors: await result.json()};
     }
     else throw new Error();
}
// delete a course by providing the course id and the credentials of the owner of the course
//who is authenticated
async function deleteCourse(id, credentials) {
     const result = await api('/courses/' + id, 'delete', null, true, credentials);
     if(result.status === 204){
          return null;
     }
     else if( result.status === 403 || result.status === 400){
          return await result.json();
     }
     else throw new Error();
}

//export all of the functions for use in our react components
export default {
     getUser,
     getCourses,
     createUser,
     getCourseById,
     createCourse,
     deleteCourse,
     updateCourse
};

 