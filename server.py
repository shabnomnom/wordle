# create a dictionary of valid words or use a n api dictionary API to validate the words: 

import requests
import random
from termcolor import colored


def create_dict():
    word_site = "https://www.mit.edu/~ecprice/wordlist.10000"
    response = requests.get(word_site)

    WORDS_RESPONSE = response.text.splitlines()
    dicts = {word for word in WORDS_RESPONSE if len(word) == 5}

    # list because random.choice only works on a list 
    answer = random.choice(list(dicts))
    return answer,dicts


class Board:

    def __init__(self,answer):
        self.rows = 6
        self.cols = 5
        self.counter = 0
        self.board = [[['_','white'] for col in range(self.cols)] for row in range(self.rows)]
        self.answer = answer
        self.answer_dict = {}
        for letter in answer:
            if letter not in self.answer_dict:
                self.answer_dict[letter] = 1
            else:
                self.answer_dict[letter] +=1

        self.finished = False
    
    # this is an instance method meaning: 
    # itcan access the class method and data using self 
    # use self as a parameter 
    def update_board(self,guess_word,dict):
        if guess_word in dict:
            green_letters = 0
            
            for index, value in enumerate(guess_word):
                copied_dict = self.answer_dict.copy()
                self.board[self.counter][index][0] = value
                if value not in self.answer_dict or self.answer_dict[value] == 0:
                    self.board[self.counter][index][1] = 'red'
                else:
                    if value == self.answer[index]:
                        green_letters +=1
                        self.board[self.counter][index][1] = 'green'
                    else:
                        self.board[self.counter][index][1] = 'yellow'
                    
                    copied_dict[value] -=1
            self.counter +=1
            if green_letters == self.cols :
                self.finished = True
            return True
        return False
    
    def is_filled(self):
        return self.counter == self.rows

    def print_board(self):
        for row in self.board:
            for letter,color in row:
                print (colored(letter,color)+" ", end ="")
            print("")

def play_game():
    answer,dict = create_dict()
    board = Board(answer)
    print(answer)
    while True:
        if board.is_filled(): 
            print("woops u out of turns")
            break
        guess_word = input("please enter your 5 letter word here: ")
        if board.update_board(guess_word,dict):
            board.print_board()
            if board.finished:
                print("congrats")
                break       
        else:
            print(" this word is not allowed")

play_game()
