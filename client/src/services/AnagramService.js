
import Api from './api'
import api from './api';

export default {
  getWords (word) {
    if (word !== '') {
      return Api().get('anagrams/' + word + '.json');
    }
    //return Api().get('posts');
  }
}