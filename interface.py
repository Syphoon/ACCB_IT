"""Inicialização da pesquisa e sua interface GUI"""

import os
import json
import sys
import threading
import scrapper
import loop
import config
import time
import urllib.request
import tkinter as tk
from tkinter import *
from tkinter import messagebox
from tkinter.ttk import *
from tkinter import ttk
from datetime import datetime
import traceback
try:
    from win10toast import ToastNotifier
except ImportError:
    pass

bg_color = "#FFFAFA"
# bg_color = "#141622"
""" Cor de fundo geral da aplicação. """
fg_color = "#000"
# fg_color = "#fff"
""" Cor de fonte geral da aplicação. """
bt_color = "#FFFAFA"
# bt_color = "#1e2133"
""" Cor de fundo (botão) geral da aplicação. """


class Lstbox:

	"""
		Por conta da forma que os elementos são instânciados dentro pelo tkinter, foi necessário separar esta janela em uma classe para facilitar o controle de dados.

		Attributes:
			root (tkinter.window): Janela principal da aplicação.
			local (string): Array de estabelecimentos a serem listados.
			start_button (tkinter.button): Botão de inicio de pesquisa, necessário para controle de estado da aplicação.
			selection (tuple): Indexes dos estabelecimentos selecionados.
	"""

	def __init__(self, root, local, start_button, type=None):

		options = {'borderwidth': 0,'highlightthickness': 0, 'selectmode': MULTIPLE}
		self.type = type
		self.root = root
		self.start_button = start_button
		self.listbox = Listbox(self.root,
								activestyle = 'dotbox',
								font = "Century 11",
								relief=tk.FLAT,
								**options,
								fg=fg_color,
								bg=bg_color)


		scrollbar = tk.Scrollbar(self.listbox)
		scrollbar.pack(side=tk.RIGHT, fill=tk.BOTH)
		self.listbox.config(yscrollcommand=scrollbar.set)
		scrollbar.config(command=self.listbox.yview)

		self.listbox.pack(expand=1, fill="both")
		self.listbox.bind("<<ListboxSelect>>", self.callback)
		for index, place in enumerate(local):

			self.listbox.insert(END, place)

		self.selection = self.listbox.curselection()

		self.start_button["state"] = tk.DISABLED

		threading.Thread(target=lambda:self.root.mainloop())

	def callback(self, a):

		""" Callback para tratar o evento de click do usuário, gerenciando o estado do botão de inicio de pesquisa. """
		if len(self.listbox.curselection()) == 1:

			self.start_button["state"] = tk.NORMAL

		elif len(self.listbox.curselection()) < 1:

			self.start_button["state"] = tk.DISABLED

		# if self.type == 'root':
		# 	if len(self.listbox.curselection()) > 1:
		# 		for i in self.listbox.curselection():
		# 			if i not in self.selection:
		# 				self.listbox.selection_clear(i)
		self.selection = self.listbox.curselection()

	def get_selected(self):

		""" Retorna os estabelecimentos selecionados."""
		return self.selection

	def destroy(self):

		""" Destroe a janela principal do programa.  """
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

	def __init__(self, function, text, button, pop_up, change_frame, frame, frame_bar, backup_check):

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
		self.backup_check = backup_check

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

				self.button["state"] = tk.NORMAL
				self.button.config(text="INICIAR PESQUISA")
				self.change_frame(self.frame_bar, self.frame)
				self.pop_up_info("Instale uma versão do google chrome para prosseguir com a pesquisa !")
				os.system('cls' if os.name=='nt' else 'clear')
				return


			self.text.set("Ocorreu um erro durante a pesquisa ... Retomando pesquisa ...")
			# self.run()
			self.change_frame(self.frame_bar, self.frame)
			self.button.config(text="INICIAR PESQUISA")
			self.backup_check(True)

		else:

			self.button["state"] = tk.NORMAL
			self.button.config(text="INICIAR PESQUISA")
			self.change_frame(self.frame_bar, self.frame)
			self.pop_up_info("Conexão de rede perdida, confirme se existe conexão com internet para prosseguir !")

	def err_log(self, e):
		""" Gera o arquivo de log de erro, err.txt no local de execução da aplicação. """

		with open('err.log', 'w+') as outfile:

			outfile.write("Date : {} \n".format(time.asctime()))
			outfile.write(e)

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

				# exc_type, exc_obj, exc_tb = sys.exc_info()
				# fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
				# print(traceback.format_exc())
				self.err_log(traceback.format_exc())
				self.exc = e
				self.except_raise()

		else:

			self.button["state"] = tk.NORMAL
			self.button.config(text="INICIAR PESQUISA")
			self.change_frame(self.frame_bar, self.frame)
			self.pop_up_info("Conexão de rede inexistente, confirme se existe conexão com internet para prosseguir !")

class Interface:

	"""
		Classe da interface (GUI) da aplicação.

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

		self.unify_state = False
		self.t = None
		self.research = False
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
		self.local_adress = None

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

	def pop_up(self, message=None):

		""" Mostra uma mensagem de alerta em pop up com opção de sim ou não """
		if message == None: message = "Uma pesquisa foi interrompida, deseja retoma-la ?"

		result = messagebox.askquestion("Pergunta", message, icon='info')

		if result == 'yes':
			return True
		else:
			return False

	def start(self, LOCALS, LOCALS_NAME):
		""" Cria a instância da classe tread com os estabelecimentos selecionados. """

		self.research = True
		self.top.destroy()
		local = []
		local_name = []
		indexes = self.selected.get_selected()
		local = [value for idx, value in enumerate(LOCALS) if idx in indexes]
		local_name = [value for idx, value in enumerate(LOCALS_NAME) if idx in indexes]

		self.text.set("Iniciando pesquisa ...")
		self.button["state"] = tk.DISABLED
		self.button.config(text="PESQUISA EM ANDAMENTO")
		self.selected.destroy()

		scrap = scrapper.Scrap(local, self.button, self.tk, self.progress_bar, self.text, self.city_name, local_name, False, self.pause_button, self, self.keywords)
		self.scrap = scrap

		tread = Tread(scrap, self.text, self.button, self.pop_up_info, self.change_frame, self.frame, self.frame_bar, self.backup_check)
		tread.daemon = True
		tread.start()
		self.thread = tread
		self.research = True
		self.change_frame(self.frame, self.frame_bar)
		return

	def on_closing(self, window_name, window):
		""" Trata os eventos de encerramento do programa. """

		if window_name == 'top':

			self.button["state"] = tk.NORMAL
			self.tk.deiconify()
			window.destroy()

		elif self.research == True:

			if messagebox.askokcancel("Pesquisa em andamento ! ", "Realmente deseja encerrar o programa ? É possível que alguns arquivos sejam corrompidos se a pesquisa não for pausada antes de encerrar o programa."):

				# self.show_message("A pesquisa foi encerrada, todo progresso foi salvo")
				window.destroy()
				sys.exit(1)

		elif self.t != None:

			if self.t.is_alive():

				if messagebox.askokcancel("Filtragem em andamento ! ", "Realmente deseja encerrar o programa ? É possível que alguns arquivos sejam corrompidos."):

					window.destroy()
					sys.exit(1)

			else:

				window.destroy()
				sys.exit(1)


		else:

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
		self.button["state"] = tk.DISABLED

		self.local_adress = self.estab[self.city.get()]
		self.city_name = self.city.get()
		self.tk.withdraw()

		if backup:

			self.text.set("Iniciando pesquisa ...")
			self.button.config(text="PESQUISA EM ANDAMENTO")
			self.change_frame(self.frame, self.frame_bar)

			self.local_adress = self.estab[self.city_name]
			scrap = scrapper.Scrap(place, self.button, self.tk, self.progress_bar, self.text, city_backup, estab, True, self.pause_button, self, self.keywords)
			self.scrap = scrap
			tread = Tread(scrap, self.text, self.button, self.pop_up_info, self.change_frame, self.frame, self.frame_bar, self.backup_check)
			tread.daemon = True
			tread.start()
			self.thread = tread
			self.research = True

		else:

			top = tk.Toplevel()
			self.top = top
			top.title('Seleção de Estabelecimentos')
			top.resizable(height=False, width=False)
			top.config(padx=15,pady=15, bg=bg_color)
			top.protocol("WM_DELETE_WINDOW", lambda: self.on_closing('top', top))

			title = tk.Label(top, wraplength=int(self.width * 0.95), text="Selecione pelo menos um estabelecimentos para iniciar a pesquisa", font='Century 11', fg=fg_color, bg=bg_color)
			title.pack()

			separator = ttk.Separator(top, orient='horizontal')
			separator.pack(fill=tk.BOTH, pady=10)

			if os.name == 'nt':
				top.iconbitmap(self.ico)

			size = len(self.local_adress)
			if size >= 10:
				mult = 60 * 4
			else:
				mult = size * 25
			top.geometry('{}x{}+{}+{}'.format(self.width, self.heigth + mult, self.tk.winfo_x(), self.tk.winfo_y()))

			start_button = tk.Button(top, text="INICIAR PESQUISA",
			# relief=tk.FLAT,
			font='Century 10' ,
			pady=7,
			padx=7,
			fg = fg_color,
			bg = bt_color,
			activeforeground=fg_color,
			activebackground=bt_color,
			command= lambda: [self.tk.deiconify(),self.start(self.city_info[self.city_name], self.local_adress)])

			self.selected = Lstbox(top, self.local_adress, start_button)
			start_button.pack(pady=10)
			return

	def backup_check(self, tread_check=False):
		""" Realiza a checagem de backup, caso o usuário inicie uma pesquisa é retornado um pop up caso tenha uma pesquisa em backup. """

		if self.t != None:

			if self.t.is_alive():

				self.show_message('Filtragem em andamento ... Aguarde o termino para continuar')
				return

			else:

				self.unify_state = False

		today = datetime.today()
		day = today.strftime("%d-%m-%Y")
		selected_city = self.city_name

		try:

			finish = 0
			date = 0
			estab = []
			place = []
			city_backup = 0

			with open('backup.json') as json_file:

				data = json.load(json_file)
				for backup in data['backup']:

					date = backup['date']
					finish = backup['done']
					estab = backup['estab']
					place = backup['place']
					city_backup = backup['city']

		except:

			self.start_search(False, None, None, None)
			return False

		if day != date:

			self.start_search(False, None, None, None)
			return False

		# Pesquisa do estabelecimento nao acabou
		if finish == 0:

			if tread_check == True:

				self.start_search(True, city_backup, estab, place)
				return True

			if city_backup == selected_city:

				if self.pop_up():

					self.start_search(True, city_backup,  estab, place)
					return True

				else:

					self.start_search(False, None, None, None)
					return False
			else:

				self.start_search(False, None, None, None)
				return False

		# Pesquisa acabou
		elif finish == 1:

			self.start_search(False, None, None, None)
			return False

	def change_frame(self,frame,frame_raise):
		""" Muda o frame renderizado na aplicação. """
		frame.pack_forget()
		frame_raise.pack(fill=tk.BOTH, pady=10)

	def pause_search(self):
		""" Pausa a pesquisa atual. """
		self.text.set("Preparando para pausar a pesquisa ...")
		self.pause_button["state"] = tk.DISABLED
		threading.Thread(target= lambda: self.scrap.exit_thread(self.thread, self.change_frame, self.frame, self.frame_bar, self.show_message)).start()
		self.research = False

	def unify(self,type):

		if self.research == False:

			if self.t != None:

				if not self.t.is_alive():

					self.unify_state = False

				else:

					self.show_message('Filtragem em andamento ... Aguarde o termino para continuar')

			if self.unify_state == False:

				if type == 'pesquisa':


					unify = loop.Filter_Colect(self.names)
					self.t = threading.Thread(target=lambda: unify.start())
					self.t.daemon = True
					self.unify_state = True
					self.t.start()


				elif type == 'todos':


					unify_all = loop.Filter_Colect_Todos(self.names, self.keywords, self.city_info)
					self.t = threading.Thread(target=lambda: unify_all.start())
					self.t.daemon = True
					self.unify_state = True
					self.t.start()

		else:

			self.show_message('Pesquisa em andamento, aguarde o termino da pesquisa e tente novamente.')

	def run(self):
		""" Inicia a instância da janela principal da aplicação. """

		# Configuração
		conf = config.Config()
		self.keywords = conf.get_config('keywords')
		self.city_info = conf.city
		self.estab = conf.estab
		names = [*self.city_info]
		self.names = names
		self.unify_state = False

		size = len(names)
		if size >= 6:
			mult = 6 * 15
		else:
			mult = size * 15

		# Window
		window = tk.Tk()
		menu = Menu(window)
		menu.config(bg=bg_color)
		self.tk = window
		window.title('ACCB - Pesquisa Automatica')
		window.resizable(height=False, width=False)
		window.config(bg=bg_color, menu=menu)
		window.protocol("WM_DELETE_WINDOW", lambda: self.on_closing('window', window))

		self.resource_path("logo.ico")
		if os.name == 'nt':
			window.iconbitmap(self.ico)

		self.width = 400
		self.heigth = 165

		self.x = (window.winfo_screenwidth() // 2) - (self.width // 2)
		self.y = (window.winfo_screenheight() // 2) - 4*(self.heigth // 2)
		window.geometry('{}x{}'.format(self.width, (self.heigth - 25) + mult))
		window.eval('tk::PlaceWindow . center')

		# Frame
		frame = tk.Frame(window, bg=bg_color)
		frame_bar = tk.Frame(window, bg=bg_color)
		frame.pack(fill=tk.BOTH, pady=10, expand=True)

		select_frame = tk.Frame(frame, bg=bg_color)

		# Menu
		menu.add_command(label="Tratar Pesquisas", command= lambda: self.unify('pesquisa'))
		menu.add_command(label="Tratar Pesquisas (Todos)", command= lambda: self.unify('todos'))
		menu.add_command(label="Configurar", command=lambda: [self.show_message("Qualquer alteração no arquivo de configuração do excel só será válida a partir da próxima inicialização do programa."), conf.open_xlsx(), ])
		menu.add_command(label="Sair", command= lambda: self.on_closing('main', window))

		# Title
		label_title = tk.Label(frame, text="Selecione o município e inicie a pesquisa", font='Century 11' , fg=fg_color, bg=bg_color)
		label_title.pack(pady=5)

		# Select
		select = ttk.Combobox(select_frame,values=names, height=size,font="Century 11")
		select['state'] = 'readonly'
		self.city_name = select
		select.current(1)
		window.option_add('*TCombobox*Listbox.font', 'Century 11')
		select.pack()
		select_frame.pack(anchor='center', fill=tk.BOTH, expand=True)

		# Button
		start_button = tk.Button(select_frame, text="INICIAR SELEÇÃO",
		# relief=tk.FLAT,
		font='Century 9',
		pady=7,
		padx=7,
		fg=fg_color,
		bg=bt_color,
		activeforeground=fg_color,
		activebackground=bt_color,
		command=lambda: self.backup_check())
		start_button.pack(pady=10)

		## FRAME 2

		# Label
		text = tk.StringVar()
		text.set("Aguardando inicio de pesquisa ...")
		label = tk.Label(frame_bar, textvariable = text, font='Century 11' , fg=fg_color, bg=bg_color)
		label.pack(pady=10)


		# Progress Bar
		progress_bar = ttk.Progressbar(frame_bar, orient=tk.HORIZONTAL, length=260, mode='determinate')
		progress_bar.pack(pady=3)

		# Button

		pause_button = tk.Button(frame_bar, text="PAUSAR PESQUISA",
		font='Century 10' ,
		pady=10,
		padx=10,
		fg = fg_color,
		bg = bg_color,
		activeforeground="white",
		activebackground=bg_color,
		command=lambda: self.pause_search())

		pause_button.pack(pady=10)
		pause_button["state"] = tk.DISABLED

		self.city = select
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


