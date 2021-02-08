from tkinter import *
from tkinter import filedialog
import os
import shutil
import tkinter as tk
from tkinter import ttk


class Scrollable(tk.Frame):
    """
       Make a frame scrollable with scrollbar on the right.
       After adding or removing widgets to the scrollable frame, 
       call the update() method to refresh the scrollable area.
    """

    def __init__(self, frame, width=16):

        scrollbar = tk.Scrollbar(frame, width=width)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, expand=False)

        self.canvas = tk.Canvas(frame, yscrollcommand=scrollbar.set)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        scrollbar.config(command=self.canvas.yview)

        self.canvas.bind('<Configure>', self.__fill_canvas)

        # base class initialization
        tk.Frame.__init__(self, frame)

        # assign this obj (the inner frame) to the windows item of the canvas
        self.windows_item = self.canvas.create_window(
            0, 0, window=self, anchor=tk.NW)

    def __fill_canvas(self, event):
        "Enlarge the windows item to the canvas width"

        canvas_width = event.width
        self.canvas.itemconfig(self.windows_item, width=canvas_width)

    def update(self):
        "Update the canvas and the scrollregion"

        self.update_idletasks()
        self.canvas.config(scrollregion=self.canvas.bbox(self.windows_item))


class GUI(Tk):
    def __init__(self):
        super().__init__()
        self.geometry('500x500')
        self.title("task organizer")

    def getting_tasks_dir(self):
        self.path = filedialog.askdirectory()
        print(self.path)
        # self.new_Button.destroy()
        self.create_todo_list(self.path)
        return self.path

    def read_tasks_file(self):
        self.hide_buttons()
        self.file_path = filedialog.askopenfilename()
        print(self.file_path)
        return self.file_path

    def hide_buttons(self):
        self.new_Button.destroy()
        self.open_Button.destroy()

    # TODO: add the checkboxes
    # TODO: add the save functionality
    def create_todo_list(self, path):
        self.hide_buttons()
        files = os.listdir(path)
        # self.create_todo_list(self.path)

        self.todos_Frame = Frame(
            self, width=100, height=100, background="bisque")

        self.todos_Frame.pack(fill=True, expand=True)
        self.vars = {
        }

        scrollable_body = Scrollable(self.todos_Frame, width=16)
        scrollable_body.con figure
        for i, Path in enumerate(files):
            self.vars[Path] = IntVar()
            print("path is: ", Path)
            Checkbutton(scrollable_body, text=Path,
                        variable=self.vars[Path]).pack(side=TOP)
        scrollable_body.update()
        print(files)

    def startButton(self, path_value):
        self.button_Frame = Frame(self)
        self.button_Frame.place(relx=.5, rely=.5, anchor=CENTER)

        # self.button_Frame.pack()
        self.new_Button = Button(self.button_Frame, text='new tasks folder',
                                 command=lambda: self.getting_tasks_dir())
        self.new_Button.pack(side=LEFT)

        self.open_Button = Button(self.button_Frame, text='open tasks file',
                                  command=lambda: self.read_tasks_file(), padx=100)
        self.open_Button.pack(side=LEFT)
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


# TODO: add menue to gui
if __name__ == '__main__':
    object = GUI()
    # path = object.getting_tasks_dir()
    object.startButton("koko")
    object.mainloop()
    print("hi")
