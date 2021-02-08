from tkinter import *
from tkinter import filedialog
import os
import shutil


class GUI(Tk):
    def __init__(self):
        super().__init__()
        self.geometry('500x500')
        self.title("task organizer")

    def getting_tasks_dir(self):
        self.path = filedialog.askdirectory()
        print(self.path)

        self.new_Button.destroy()
        self.create_todo_list(self.path)
        return self.path

    def read_tasks_file(self):
        self.file_path = filedialog.askopenfilename()
        print(self.file_path)
        return self.file_path

    def create_todo_list(self, path):
        files = os.listdir(path)
        print(files)

    def startButton(self, path_value):
        self.button_Frame = Frame(self)
        self.button_Frame.place(relx=.5, rely=.5, anchor=CENTER)

        # self.button_Frame.pack()
        self.new_Button = Button(self.button_Frame, text='new tasks folder',
                                 command=lambda: self.getting_tasks_dir())
        self.new_Button.pack(side=LEFT)

        self.new_Button = Button(self.button_Frame, text='open tasks file',
                                 command=lambda: self.read_tasks_file(), padx=100).pack(side=LEFT)
        # self.new_Button.place(relx=.5, rely=.5, anchor=CENTER)

    def todoList(self):
        self.todo_list = self

    def startOperation(self, path_value):
        count = 0
        os.chdir(path_value)
        self.file_list = os.listdir()
        no_of_files = len(self.file_list)
        if len(self.file_list) == 0:
            self.error_label = Label(text="Erroe empty folder").pack()
            exit()
        for file in self.file_list:
            if file.endswith(".png"):
                self.dir_name = "PngFiles"
                self.new_path = os.path.join(path_value, self.dir_name)
                self.file_list = os.listdir()
                if self.dir_name not in self.file_list:
                    os.mkdir(self.new_path)
                shutil.move(file, self.new_path)

            elif file.endswith(".txt"):
                self.dir_name = "TextFiles"
                self.new_path = os.path.join(path_value, self.dir_name)
                self.file_list = os.listdir()
                if self.dir_name not in self.file_list:
                    os.mkdir(self.new_path)
                shutil.move(file, self.new_path)
            count = count+1

        if(count == no_of_files):
            success = Label(text="Operation Successful!").pack()
        else:
            error = Label(text="Failed").pack()


if __name__ == '__main__':
    object = GUI()
    # path = object.getting_tasks_dir()
    object.startButton("koko")
    object.mainloop()
    print("hi")
