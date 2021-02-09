import os
import json
import sys
import tkinter as tk
import threading
import scrapper
import time
from tkinter import *
from tkinter import messagebox
from tkinter.ttk import * 
from tkinter import ttk
from datetime import datetime
try:
    from win10toast import ToastNotifier
except ImportError:
    pass

bg_color = "#141622"
fg_color = "#fff"


class Lstbox:
    
    def __init__(self, root, local, start_button):
        
        self.root = root
        self.start_button = start_button
        self.listbox = Listbox(self.root, selectmode=MULTIPLE, 
                                activestyle = 'dotbox',  
                                font = "Times 11", 
                                relief=tk.FLAT,
                                borderwidth=0, 
                                highlightthickness=0,
                                fg=fg_color,
								bg=bg_color)
        
        self.listbox.pack(expand=1, fill="both")
        self.listbox.bind("<<ListboxSelect>>", self.callback)
        for index, place in enumerate(local):
           
            self.listbox.insert(END, place)
        
        self.selection = self.listbox.curselection()
        
        self.start_button["state"] = tk.DISABLED
                    
        threading.Thread(target=lambda:self.root.mainloop())
 
    def callback(self, a):
        
        if len(self.listbox.curselection()) == 2:
            
            self.start_button["state"] = tk.NORMAL
            
        elif len(self.listbox.curselection()) < 2:
            
            self.start_button["state"] = tk.DISABLED
            
        if len(self.listbox.curselection()) > 2:
            for i in self.listbox.curselection():
                if i not in self.selection:
                    self.listbox.selection_clear(i)
        self.selection = self.listbox.curselection()
    
    def get_selected(self):
        
        return self.selection
    
    def destroy(self):
        
        self.root.destroy()

class Tread(threading.Thread):

	def __init__(self, function, text, button, pop_up, ):

		super(Tread, self).__init__()
		self.event = threading.Event()
		self.func = function
		self.text = text 
		self.button = button
		self.exc = None            
		self.pop_up = pop_up
	
	def set_event(self):

		self.event.set()
	
	def pop_up_info(self):

		messagebox.showinfo("ERROR","Instale uma versão do google chrome para prosseguir com a pesquisa !", icon='warning')

	def except_raise(self):

		driver = self.func.get_driver()
		bar = self.func.get_progess_bar()
		bar["value"] = 0
		if driver != None:
		
			driver.close()
			driver.quit()
			self.pop_up()
	
		else:
			
			self.pop_up_info()

		
		self.text.set("Ocorreu um erro durante a pesquisa, comece novamente !")
		self.button["state"] = tk.NORMAL
		self.button.config(text="INICIAR PESQUISA")
	
	def err_log(self, typ, fname, line, e):

		err = {}
		err['err'] = []
		err['err'].append({"Tipo": typ, "Arquivo": fname, "Linha": line, "Erro": e})
		with open('err.json', 'w+') as outfile:
		
			json.dump(err, outfile)

	def run(self): 
			
		try: 
			self.func.run() 
		except BaseException as e: 
			
			exc_type, exc_obj, exc_tb = sys.exc_info()
			fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
			# print(exc_type, fname, exc_tb.tb_lineno)
			# print(e)
			self.err_log(str(exc_type), str(fname), str(exc_tb.tb_lineno), str(e))
			self.exc = e 
			self.except_raise()
		
class Interface:
    
	def __init__(self):

		self.button = None
		self.tk = None
		self.text = None
		self.city = None
		self.city_name = None
		self.selected = None
		self.progress_bar = None
		self.selected = None
		self.ico = None
		self.frame = None
		self.frame_bar = None
		self.scrap = None
		self.thread = None
		self.pause_button = None

	def resource_path(self,relative_path):
		""" Get absolute path to resource, works for dev and for PyInstaller """
		try:
			# PyInstaller creates a temp folder and stores path in _MEIPASS
			base_path = sys._MEIPASS
		except Exception:
			base_path = os.path.abspath(".")

		self.ico = os.path.join(base_path, relative_path)

	def show_message(self, message):
    
		return messagebox.showinfo("Info", message, icon='warning')

	def pop_up_info(self):

		messagebox.showinfo("ERROR","Ocorreu um erro durante a pesquisa, comece novamente !", icon='info')
    
	def pop_up(self):
		
		result = messagebox.askquestion("Backup","Uma pesquisa foi interrompida, deseja retoma-la ?", icon='warning')

		if result == 'yes':
			return True
		else:
			return False

	def start(self, LOCALS, LOCALS_NAME):
		
		local = []
		local_name = []
		index_1 , index_2 = self.selected.get_selected()
		local.append(LOCALS[index_1])
		local.append(LOCALS[index_2])
		local_name.append(LOCALS_NAME[index_1])
		local_name.append(LOCALS_NAME[index_2])
		self.text.set("Iniciando pesquisa ...")
		self.button["state"] = tk.DISABLED
		self.button.config(text="PESQUISA EM ANDAMENTO")
		self.selected.destroy()
			
		scrap = scrapper.Scrap(local, self.button, self.tk, self.progress_bar, self.text, self.city_name, local_name, False, self.pause_button)
		self.scrap = scrap

		tread = Tread(scrap, self.text, self.button, self.pop_up_info)
		tread.start() 
		self.thread = tread

		self.change_frame(self.frame, self.frame_bar)

	def on_closing(self, window_name, window):

		if window_name == 'top':

			self.button["state"] = tk.NORMAL
			window.destroy()

		elif messagebox.askokcancel("Sair", "Realmente deseja encerrar a pesquisa ?"):

			self.show_message("A pesquisa foi encerrada, todo progresso foi salvo")
			window.destroy()

	def start_search(self, backup, city_backup, estab, place):
				
		selected = 0
		product_1 = 0
		product_2 = 0

		self.button["state"] = tk.DISABLED

		LOCALS_NAME_ITN = ['Supermercado Itao',
							'Supermercado Carisma',
							'Supermercado HiperBompreco',		
							'Supermercado Meira',	
							'Mercado Mattos',		
							'Supermercado Barateiro',		
							'Híper Itao',		
							'Atacadao Rondelli',		
							'Mercado Dois Imaos',		
							'Maxx Atacado',		
							'Padaria Le & Gi',		
							'Supermercado Compre Bem',
							]

		LOCALS_ITN = ['ITAO',		
					'COMPRE AQUI',		
					'BOMPRECO',	
					'DALNORDE',		
					'MATTOS',		
					'SUPERMERCADO BARATEIRO',		
					'HIPER ITAO',		
					'RONDELLI',		
					'IRMAOS',		
					'MAXXI',	
					'NOVO BARATEIRO',	
					'COMPRE BEM']

		LOCALS_NAME_IOS = [ 'Itao Supermercado',		
							'Supermercado Meira',		
							'Supermercado Mangostao',		
							'Gbarbosa', 		
							'Jaciana Supermercado', 		
							'Alana Supermercado',		
							'Mercadinho e Frutaria Claudinete',		
							'Nenem Supermercados',   		
							'Cestao da Economia',		
							'Atacadao',
							]

		LOCALS_IOS = ['ITAO',
					'DALNORDE',
					'SUPERMERCADO MANGOSTÃO',
					'GBARBOSA',
					'JACIANA SUPERMERCADO',
					'ALANA SUPERMERCADO',
					'MECARDINHO E FRUTARIA CLAUDINTE',
					'NENEM SUPERMERCADOS',
					'SEM NOME',
					'ATACADAO']

		if backup:

			self.text.set("Iniciando pesquisa ...")
			self.button.config(text="PESQUISA EM ANDAMENTO")
			self.change_frame(self.frame, self.frame_bar)

			if city_backup == 'Itabuna':

					
				scrap = scrapper.Scrap(place, self.button, self.tk, self.progress_bar, self.text, city_backup, estab, True, self.pause_button)
				self.scrap = scrap
				tread = Tread(scrap, self.text, self.button, self.pop_up_info)
				tread.start()
				self.thread = tread

			elif city_backup == 'Ilhéus':

				self.scrap = scrap	
				scrap = scrapper.Scrap(place, self.button, self.tk, self.progress_bar, self.text, city_backup, estab, True, self.pause_button)
				tread = Tread(scrap, self.text, self.button, self.pop_up_info)
				tread.start()
				self.thread = tread

		else:

			top = tk.Toplevel()
			top.title('Seleção de Estabelecimentos')
			top.resizable(height=False, width=False)
			top.config(padx=15,pady=15, bg=bg_color)
			top.protocol("WM_DELETE_WINDOW", lambda: self.on_closing('top', top))

			title = tk.Label(top, text="Selecione dois estabelecimentos para iniciar a pesquisa", font='Times 11' , fg=fg_color, bg=bg_color)
			title.pack(pady=5)
			
			if os.name == 'nt':
				top.iconbitmap(self.ico)

			width = 350
			heigth = 360

			x = (top.winfo_screenwidth() // 2) - (width // 2)
			y = (top.winfo_screenheight() // 2) - (heigth // 2)
			top.geometry('{}x{}+{}+{}'.format(width, heigth, x + width, y))

			if self.city.get() == 1:


				start_button = tk.Button(top, text="INICIAR PESQUISA", 
				font='Times 10' , 
				pady=7, 
				padx=7, 
				fg = fg_color,
				bg = bg_color,
				activeforeground="white",
				activebackground=bg_color,
				bd =  5, 
				command= lambda: self.start(LOCALS_ITN,LOCALS_NAME_ITN))

				self.city_name = "Itabuna"
				# ITABUNA

				self.selected = Lstbox(top, LOCALS_NAME_ITN, start_button)
				start_button.pack()

			elif self.city.get() == 2:

				start_button = tk.Button(top, text="INICIAR PESQUISA", 
				font='Times 10' , 
				pady=7, 
				padx=7, 
				fg = fg_color,
				bg = bg_color,
				activeforeground="white",
				activebackground=bg_color,
				bd =  5, 
				command= lambda: self.start(LOCALS_IOS,LOCALS_NAME_IOS))

				self.city_name = "Ilhéus"
				# ILHÉUS

				self.selected = Lstbox(top, LOCALS_NAME_IOS, start_button)
				start_button.pack()

	def backup_check(self):

		today = datetime.today()
		day = today.strftime("%d-%m-%Y")
		
		try:
		
			finish = 0
			date = 0
			estab_1 = 0
			place_1 = 0
			place_2 = 0
			estab_2 = 0
			city_backup = 0
			
			with open('backup.json') as json_file:

				data = json.load(json_file)
				for backup in data['backup']:
					
					date = backup['date']    
					finish = backup['done']
					estab_1 = backup['estab_1']
					estab_2 = backup['estab_2']
					place_1 = backup['place_1']
					place_2 = backup['place_2']
					city_backup = backup['city']
					
		except:
			
			self.start_search(False, None, None, None)
			return
		
		if day != date:

			self.start_search(False, None, None, None)
			return
			
		# Pesquisa do estabelecimento nao acabou
		if finish == 0:
			
			if self.pop_up():
				
				self.start_search(True, city_backup, [estab_1, estab_2], [place_1, place_2])
				return

			else:
				
				self.start_search(False, None, None, None)
				return
		
		elif finish == 1:
			
			self.start_search(False, None, None, None)
			return

	def change_frame(self,frame,frame_raise):

		# print("Mudando de frame ...")
		frame.pack_forget()
		frame_raise.pack(fill=tk.BOTH, pady=10)

	def pause_search(self):
		
		self.text.set("Preparando para pausar a pesquisa ...")
		self.pause_button["state"] = tk.DISABLED
		threading.Thread(target= lambda: self.scrap.exit_thread(self.thread, self.change_frame, self.frame, self.frame_bar, self.show_message)).start()

	def run(self):

		# Window
		window = tk.Tk()
		self.tk = window
		window.title('ACCB - Pesquisa Automatica')
		window.resizable(height=False, width=False)
		window.config(bg=bg_color)
		window.protocol("WM_DELETE_WINDOW", lambda: self.on_closing('window', window))

		self.resource_path("logo.ico")
		if os.name == 'nt':
			window.iconbitmap(self.ico)

		width = 350
		heigth = 165

		x = (window.winfo_screenwidth() // 2) - (width // 2)
		y = (window.winfo_screenheight() // 2) - (heigth // 2)
		window.geometry('{}x{}+{}+{}'.format(width, heigth, x, y))

		# Frame

		frame = tk.Frame(window, bg=bg_color)
		frame_bar = tk.Frame(window, bg=bg_color)
		frame.pack(fill=tk.BOTH, pady=10)

		# Title
		label_title = tk.Label(frame, text="Selecione o município e inicie a pesquisa", font='Times 11' , fg=fg_color, bg=bg_color)
		label_title.pack(pady=5)

		# RadioButton

		var = tk.IntVar()
		var.set(1)
		radio_1 = tk.Radiobutton(frame, text="Itabuna", font='Times 11', variable=var,value=1, bg=bg_color, fg=fg_color, activebackground=bg_color, highlightcolor=fg_color, selectcolor=bg_color, activeforeground=fg_color)
		radio_1.pack()

		radio_2 = tk.Radiobutton(frame, text="Ilhéus", font='Times 11', variable=var, value=2, bg=bg_color, fg=fg_color, activebackground=bg_color, highlightcolor=fg_color, selectcolor=bg_color, activeforeground=fg_color)
		radio_2.pack()

		# Button
	
		start_button = tk.Button(frame, text="INICIAR PESQUISA",
		# relief=tk.FLAT, 
		font='Times 10' , 
		pady=7, 
		padx=7, 
		fg = fg_color,
		bg = bg_color,
		activeforeground="white",
		activebackground=bg_color,
		bd =  5, 
		command=lambda: self.backup_check())
		start_button.pack(pady=5)		
		
		# top = tk.Toplevel()
		
		## FRAME 2
  
		# Label
		text = tk.StringVar()
		text.set("Aguardando inicio de pesquisa ...")
		label = tk.Label(frame_bar, textvariable = text, font='Times 10' , fg=fg_color, bg=bg_color)
		label.pack(pady=10)

		
		# Progress Bar
		progress_bar = ttk.Progressbar(frame_bar, orient=tk.HORIZONTAL, length=260, mode='determinate')
		progress_bar.pack(pady=10)

		# Button

		pause_button = tk.Button(frame_bar, text="PAUSAR PESQUISA",
		font='Times 10' , 
		pady=7, 
		padx=7, 
		fg = fg_color,
		bg = bg_color,
		activeforeground="white",
		activebackground=bg_color,
		bd =  5, 
		command=lambda: self.pause_search())

		pause_button.pack(pady=10)
		pause_button["state"] = tk.DISABLED		
		
		self.city = var
		self.button = start_button
		self.progress_bar = progress_bar
		self.text = text
		self.frame = frame
		self.frame_bar = frame_bar
		self.pause_button = pause_button
	
		window.mainloop()
		# top.mainloop()
	
    
window = Interface()
window.run()