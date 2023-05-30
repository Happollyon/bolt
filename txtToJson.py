#import a txt file and convert it to json format


import json
import os

def txt_to_json(txt_path):
    # read the text file
    print("(+) reading txt file..")
    with open(txt_path, 'r') as f:
        lines = f.readlines()

    # create a list of values from the lines
    values = [line.strip() for line in lines]

    # write the values to a JSON file
    print("(+) Creating .json file..")
    json_path = os.path.splitext(txt_path)[0] + '.json'
    with open(json_path, 'w') as f:
        print("(+) Writing file..")
        json.dump(values, f)
if __name__ == '__main__':

    path = input("enter TXT path:  ")
    print("(+) Running txtToJson.py...")
    # code to run when the file is executed goes here
    txt_to_json(path)
