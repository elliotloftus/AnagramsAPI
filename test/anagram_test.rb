#!/usr/bin/env ruby

require 'json'
require_relative 'anagram_client'
require 'test/unit'

# capture ARGV before TestUnit Autorunner clobbers it

class TestCases < Test::Unit::TestCase

  # runs before each test
  def setup
    @client = AnagramClient.new(ARGV)

    # add words to the dictionary
    @client.post('/words.json', nil, {"words" => ["read", "dear", "dare"] }) rescue nil
  end

  # runs after each test
  def teardown
     # delete everything
    @client.delete('/words.json') rescue nil
  end

  def test_adding_words
    res = @client.post('/words.json', nil, {"words" => ["read", "dear", "dare"] })

    assert_equal('201', res.code, "Unexpected response code")
  end

  def test_fetching_anagrams
     # delete me

    # fetch anagrams
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")
    assert_not_nil(res.body)

    body = JSON.parse(res.body)

    assert_not_nil(body['anagrams'])

    expected_anagrams = %w(dare dear)
    assert_equal(expected_anagrams, body['anagrams'].sort)
  end

  def test_fetching_anagrams_with_limit
    # delete me

    # fetch anagrams with limit
    res = @client.get('/anagrams/read.json', 'limit=1')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(1, body['anagrams'].size)
  end

  def test_fetching_anagrams_with_proper

    res = @client.post('/words.json', nil, {"words" => ["Read", "Dear",] })

    assert_equal('201', res.code, "Unexpected response code")

    #get words and proper nouns
    res = @client.get('/anagrams/read.json', 'proper=true')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_not_nil(body['anagrams'])

    expected_anagrams = %w(Dear Read dare dear)
    assert_equal(expected_anagrams, body['anagrams'].sort)


    #get words without proper nouns
    res = @client.get('/anagrams/read.json', 'proper=no')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_not_nil(body['anagrams'])

    expected_anagrams = %w(dare dear )
    assert_equal(expected_anagrams, body['anagrams'].sort)
  end
  def test_fetch_for_word_with_no_anagrams
     # delete me

    # fetch anagrams with limit
    res = @client.get('/anagrams/zyxwv.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_all_words
    # delete me

    res = @client.delete('/words.json')

    assert_equal('204', res.code, "Unexpected response code")

    # should fetch an empty body
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_all_words_multiple_times
     # delete me

    3.times do
      res = @client.delete('/words.json')

      assert_equal('204', res.code, "Unexpected response code")
    end

    # should fetch an empty body
    res = @client.get('/anagrams/read.json', 'limit=1')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)
  end

  def test_deleting_single_word
    # delete me

    # delete the word
    res = @client.delete('/words/dear.json')

    assert_equal('204', res.code, "Unexpected response code")

    # expect it not to show up in results
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(['dare'], body['anagrams'])

  end

  def test_deleting_word_and_anagrams
    # delete me

    # delete the word
    res = @client.delete('/anagrams/dear.json')

    assert_equal('204', res.code, "Unexpected response code")

    # expect it not to show up in results
    res = @client.get('/anagrams/read.json')

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(0, body['anagrams'].size)

  end


  def test_check_words_are_anagrams

    #test words that are anagrams
    res = @client.post('/anagramCheck.json',nil,{"words" => ["read", "dear", "dare"] }) rescue nil

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(true, body['result'])
  end

  def test_check_words_are_not_anagrams 
    #test words that are not anagrams
    res = @client.post('/anagramCheck.json',nil,{"words" => ["read", "dear", "dbre"] }) rescue nil

    assert_equal('200', res.code, "Unexpected response code")

    body = JSON.parse(res.body)

    assert_equal(false, body['result'])

  end



end
