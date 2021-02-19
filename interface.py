"""Inicialização da pesquisa e sua interface GUI"""

import os
import json
import sys
import threading
import scrapper
import time
import urllib.request
import tkinter as tk
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
""" Cor de fundo geral da aplicação. """
fg_color = "#fff"
""" Cor de fonte geral da aplicação. """

class Lstbox: 

	""" 
		Por conta da forma que os elementos são instânciados dentro pelo tkinter, foi necessário separar esta janela em uma classe para facilitar o controle de dados.

		Attributes:
			root (tkinter.window): Janela principal da aplicação.  
			local (string): Array de estabelecimentos a serem listados.  
			start_button (tkinter.button): Botão de inicio de pesquisa, necessário para controle de estado da aplicação.    
			selection (tuple): Indexes dos estabelecimentos selecionados. 
	"""
    
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

		""" Callback para tratar o evento de click do usuário, gerenciando o estado do botão de inicio de pesquisa. """
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

		""" Retorna os estabelecimentos selecionados."""
		return self.selection

	def destroy(self):

		""" Destroi a janela principal do programa.  """
		self.root.destroy()

class Tread(threading.Thread):

	""" 
		Classe responsável por chamar o metodo run da Classe Scrap, iniciando um thread separado do main e tratando os seus erros.

		Attributes:
			function (Scrap): Intância da classe Scrap.  
			text (tkinter.label): Label responsável pela mensagem da aba de pesquisa.  
			pop_up (Interface.pop_up): Função que mostra mensagem de erro generica.  
			change_frame (Interface.change_frame): Função que troca entre as janelas de pesquisa e inicial.   
			frame (tkinter.frame): Janela principal da aplicação.  
			frame_bar (tkinter.frame): Janela de pesquisa da aplicação.  
	"""

	def __init__(self, function, text, button, pop_up, change_frame, frame, frame_bar):

		super(Tread, self).__init__()
		self.event = threading.Event()
		self.func = function
		self.text = text 
		self.button = button
		self.exc = None            
		self.pop_up = pop_up
		self.change_frame = change_frame
		self.frame = frame
		self.frame_bar = frame_bar
	
	def pop_up_info(self, message):

		""" Mostra em pop_up a mensagem desejada. """
		messagebox.showinfo("ERROR", message, icon='warning')

	def except_raise(self):

		"""
			Quando um erro é detectado este método é chamado, tratando o tipo de erro. O erro pode ser de conexão ou um erro de 
			falta de requisitos para executar a aplicação (Instalação do google chrome).
		"""
		driver = self.func.get_driver()
		bar = self.func.get_progess_bar()
		bar["value"] = 0

		if self.connect():

			if driver != None:
			
				driver.close()
				driver.quit()
				# self.pop_up()
		
			else:
				
				self.pop_up_info("Instale uma versão do google chrome para prosseguir com a pesquisa !")

			
			self.text.set("Ocorreu um erro durante a pesquisa ... Retomando pesquisa ...")
			self.run()
		
		else:

			self.button["state"] = tk.NORMAL
			self.button.config(text="INICIAR PESQUISA")
			self.change_frame(self.frame_bar, self.frame)
			self.pop_up_info("Conexão de rede perdida, confirme se existe conexão com internet para prosseguir !")
	
	def err_log(self, typ, fname, line, e):
		""" Gera o arquivo de log de erro, err.js no local de execução da aplicação. """
		err = {}
		err['err'] = []
		err['err'].append({"Tipo": typ, "Arquivo": fname, "Linha": line, "Erro": e})
		with open('err.json', 'w+') as outfile:
		
			json.dump(err, outfile)

	def connect(self):
		
		""" Realiza um teste de conexão com o link desejado. """
		host='https://stackoverflow.com'
		try:
			urllib.request.urlopen(host) 
			return True
		except:
			return False
	
	def run(self): 
		
		""" Executa o método run da Classe Scrap e trata para erro de rede. """
		if	self.connect():

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

		else:

			self.button["state"] = tk.NORMAL
			self.button.config(text="INICIAR PESQUISA")
			self.change_frame(self.frame_bar, self.frame)
			self.pop_up_info("Conexão de rede inexistente, confirme se existe conexão com internet para prosseguir !")

class Interface:

	""" 
		Classe da interface GUI da aplicação.

		Attributes:
			button (tk.Button): Instância do objeto tk.Button, responsável pelo inicio da pesquisa.  
			pause_button (tk.Button): Instância do objeto tk.Button, responsável por pausar a pesquisa.  
			text (tk.Label): Label responsável pela mensagem da aba de pesquisa.  
			tk (tk.Window): Janela principal da aplicação.  
			city (string): Array de strings contendo as cidades a serem selecionadas.  
			city_name (string): Array de strings contendo os nomes das cidades a serem selecionadas.  
			selected (tuple): Tupla contendo os indíces das cidades selecionadas.  
			ico (string): Caminho do ícone da aplicação.  
			frame (tk.Frame): Janela principal da aplicação.  
			frame_bar (tk.Frame): Janela de pesquisa da aplicação.  
			thread (Tread): Instância da classe Tread.  
	"""
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
		""" Retorna o caminho relativo do ícone dentro da pasta de cache gerada pelo pyinstaller (Pacote usado para gerar o arquivo executável da aplicação). """
		try:
			base_path = sys._MEIPASS
		except Exception:
			base_path = os.path.abspath(".")

		self.ico = os.path.join(base_path, relative_path)

	def show_message(self, message):
		""" Mostra uma determinada mensagem informativa em pop up. """
		return messagebox.showinfo("Info", message, icon='warning')

	def connect(self):
		
		host='https://stackoverflow.com'
		try:
			urllib.request.urlopen(host) 
			return True
		except:
			return False
	
	def pop_up_info(self):
		
		""" Mostra uma mensagem de erro em pop up. """
		messagebox.showinfo("ERROR","Ocorreu um erro durante a pesquisa, comece novamente !", icon='warning')
    
	def pop_up(self):
		
		""" Mostra uma mensagem de alerta em pop up. """
		result = messagebox.askquestion("Backup","Uma pesquisa foi interrompida, deseja retoma-la ?", icon='info')

		if result == 'yes':
			return True
		else:
			return False

	def start(self, LOCALS, LOCALS_NAME):
		""" Cria a instância da classe tread com os estabelecimentos selecionados. """
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
			
		scrap = scrapper.Scrap(local, self.button, self.tk, self.progress_bar, self.text, self.city_name, local_name, False, self.pause_button, self)
		self.scrap = scrap

		tread = Tread(scrap, self.text, self.button, self.pop_up_info, self.change_frame, self.frame, self.frame_bar)
		tread.start() 
		self.thread = tread

		self.change_frame(self.frame, self.frame_bar)

	def on_closing(self, window_name, window):
		""" Trata os eventos de encerramento do programa. """
		if window_name == 'top':

			self.button["state"] = tk.NORMAL
			window.destroy()

		elif messagebox.askokcancel("Sair", "Realmente deseja encerrar a pesquisa ?"):

			self.show_message("A pesquisa foi encerrada, todo progresso foi salvo")
			window.destroy()
			sys.exit()

	def start_search(self, backup, city_backup, estab, place):
		""" 
			Trata o início da pesquisa, passando adiante os parâmentros de cidade e estabeleciomento selecionados. 

			Attributes:
				backup (boolean): Booleano responsável por dizer se a pesquisa foi iniciada a partir de um backup ou não.  
				city_backup (string): Cidade de qual o backup foi iniciado.  
				estab (string): Array de estabelecimentos de qual o backup foi iniciado.  
				place (string): Array de nomes dos estabelecimentos de qual o backup foi iniciado.  

		"""		
		selected = 0
		product_1 = 0
		product_2 = 0

		self.button["state"] = tk.DISABLED

		LOCALS_NAME_ITN = ['Supermercado Itao',
							'Compre Aqui',
							'Supermercado HiperBompreco',		
							'Supermercado Meira',	
							'Mercado Mattos',		
							'Supermercado Barateiro',		
							'Híper Itao',		
							'Atacadao Rondelli',		
							'Mercado Dois Imaos',		
							'Maxx Atacado',		
							'Padaria Le & Gi',		
							'Compre Bem',
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
					'MANGOSTÃO',
					'GBARBOSA',
					'JACIANA',
					'ALANNA',
					'CLAUDINTE',
					'NENEM',
					'CESTAO',
					'ATACADAO']

		if backup:

			self.text.set("Iniciando pesquisa ...")
			self.button.config(text="PESQUISA EM ANDAMENTO")
			self.change_frame(self.frame, self.frame_bar)

			if city_backup == 'Itabuna':

					
				scrap = scrapper.Scrap(place, self.button, self.tk, self.progress_bar, self.text, city_backup, estab, True, self.pause_button, self)
				self.scrap = scrap
				tread = Tread(scrap, self.text, self.button, self.pop_up_info, self.change_frame, self.frame, self.frame_bar)
				tread.start()
				self.thread = tread

			elif city_backup == 'Ilhéus':

				scrap = scrapper.Scrap(place, self.button, self.tk, self.progress_bar, self.text, city_backup, estab, True, self.pause_button, self)
				self.scrap = scrap	
				tread = Tread(scrap, self.text, self.button, self.pop_up_info, self.change_frame, self.frame, self.frame_bar)
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
		""" Realiza a checagem de backup, caso o usuário inicie uma pesquisa é retornado um pop up caso tenha uma pesquisa em backup. """
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
		""" Muda o frame renderizado na aplicação. """
		frame.pack_forget()
		frame_raise.pack(fill=tk.BOTH, pady=10)

	def pause_search(self):
		""" Pausa a pesquisa atual. """
		self.text.set("Preparando para pausar a pesquisa ...")
		self.pause_button["state"] = tk.DISABLED
		threading.Thread(target= lambda: self.scrap.exit_thread(self.thread, self.change_frame, self.frame, self.frame_bar, self.show_message)).start()

	def run(self):
		""" Inicia a instância da janela principal da aplicação. """
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
    
    
if __name__ == '__main__':
    
	window = Interface()
	window.run()