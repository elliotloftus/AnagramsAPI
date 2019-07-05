<template>
  <div class="container">
    <h1>Find Anagrams</h1>
    <div>
      <input class = "input" @keyup="goGetAnagrams" v-model = "input" id="get-anagrams" type="text" placeholder="Enter a word"></input>
    </div>
      <div v-if="input !== ''">
        <div class ="message">Found {{length}} anagrams for {{input}}</div>
      </div>
      <div v-for="word in words" v-bind:key="word">
        <b>{{ word }}</b> 
      </div>
    </div>
</template>

<script>
import AnagramService from '@/services/AnagramService/';
import TextInput from '@/views/TextInput/';
export default {
  name: 'AnagramComponent',
  components: {TextInput},
  data() {
    return {
      words: [],
      error: '',
      length: 0,
      input: ''
    }
  },
  methods: {
    goGetAnagrams: function (){
      if (this.input == '') {
        this.words = [];
      }
      else {
        AnagramService.getWords(this.input).then((response) => {
          console.log(response.data.anagrams);
          this.words = response.data.anagrams;
          this.length = response.data.anagrams.length;
        })
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.input {
  font-size: 15px;
  width: 50%;
  border: 0;
  border-bottom: 2px black solid;
  background-color: transparent;
  font-family: 'Segoe UI', 'San Francisco', 'Roboto', sans-serif;
  outline: none;
}
.message {
  margin-top: 25px;
  margin-bottom: 15px;
}
</style>

