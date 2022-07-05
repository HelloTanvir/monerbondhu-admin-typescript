import Axios from 'axios';

// export const axios = Axios.create({baseURL: 'http://3.22.167.8'});
const axios = Axios.create({ baseURL: 'https://blooming-beach-78806.herokuapp.com' });
// const axios = Axios.create({ baseURL: 'http://localhost:8080' });
// const axios = Axios.create({ baseURL: 'https://18.191.211.173.nip.io/' });

export default axios;
