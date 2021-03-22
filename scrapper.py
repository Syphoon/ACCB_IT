""" Script responsável por realizar o scrapping na plataforma do Preço da Hora Bahia. """
import re
import time
import csv
import os
import threading
import json
import sys
import urllib.request
import pandas as pd
from xlsxwriter.workbook import Workbook
from tkinter import messagebox
from datetime import date
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
try:
    from win10toast import ToastNotifier
except ImportError:
    pass

class Scrap:
	
	""" 
		Classe responsável por realizar o scrapping na página do Preço da Hora Bahia.

		Attributes:
			LOCALS (string): Array de estabelecimentos que será relaizado a pesquisa.  
			LOCALS_NAME (string): Array de nomes dos estabelecimentos que será relaizado a pesquisa.  
			BUTTON (tk.Button): Instância do botão da janela inicial da aplicação.
			PAUSE_BUTTON (tk.Button): Instância do botão da janela de pesquisa da aplicação.  
			TK (tk.Window): Instância da janela principal da aplicação.  
			TXT (tk.ProgressBar): Instância da barra de progresso.  
			BACKUP (boolean): Indica se a pesquisa iniciada é um backup ou não.
			INTERFACE (Interface.self): Instância da classe Interface.
	"""

	def __init__(self,LOCALS, BUTTON, TK, PROGRESS_BAR, TXT, CITY, LOCALS_NAME, BACKUP, PAUSE_BUTTON, INTERFACE=None):

		self.BUTTON = BUTTON
		self.PAUSE_BUTTON = PAUSE_BUTTON
		self.LOCALS = LOCALS
		self.TK = TK
		self.PROGRESS_BAR = PROGRESS_BAR
		self.TXT = TXT
		self.CITY = CITY
		self.LOCALS_NAME = LOCALS_NAME
		self.BACKUP = BACKUP
		self.INTERFACE = INTERFACE
		self.csvfile = None
		self.all_file = None
		self.driver = None
		self.keywords = None
		self.ico = None
		self.stop = False
		self.exit = False
	
	def filter_word(self, product_name, product):

		words = product_name.split(" ")

		found_product = False

		for word in words:

			if  word in product:
				
				found_product = True
			
			else: 
				
				found_product = False

		return(found_product)

	def connect(self):
		
		""" Confere a conexão com o host desejado. """
		host='https://www.youtube.com'
		try:
			urllib.request.urlopen(host) 
			return True
		except:
			return False
	
	def resource_path(self, relative_path):
		""" Retorna o caminho relativo do ícone dentro da pasta de cache gerada pelo pyinstaller (Pacote usado para gerar o arquivo executável da aplicação). """
		try:
			# PyInstaller creates a temp folder and stores path in _MEIPASS
			base_path = sys._MEIPASS
		except Exception:
			base_path = os.path.abspath(".")

		self.ico = os.path.join(base_path, relative_path)

	def get_progess_bar(self):

		""" Retorna a instância da barra de progresso. """
		return self.PROGRESS_BAR

	def exit_thread(self, thread, change_frame, frame, frame_bar, show_message):

		""" 
			Pausa a pesquisa caso aconteça um erro de rede ou o usuário pause-a manualmente.  

			Attributes:
				thread (Tread): Instância da classe Tread.  
				change_frame (Interface.change_frame): Função responsável por mudar o frame renderizado atualmente.  
				frame (tk.Frame): Instância da janela principal da aplicação.  
				frame_bar (tk.Frame): Instância da janela de pesquisa da aplicação.  
				show_message (Interface.show_message): Função que mostra uma mensagem x em pop up.  
		
		"""
		self.stop = True
		if thread != None:
				
			while True:

				if self.exit:

					# print("Pausando pesquisa ...")
					# FRAME MAIN
					self.BUTTON.config(text="INICIAR PESQUISA")
					self.BUTTON["state"] = "normal"
					change_frame(frame_bar, frame)
					
					# FRAME BAR
					self.TXT.set("Aguardando inicio de pesquisa ...")
					self.PROGRESS_BAR['value'] = 0
					# self.PAUSE_BUTTON["state"] = "normal"
					show_message("A pesquisa foi parada, todo o progresso foi salvo na pasta do município e sua respectiva data")
					
					self.driver.close()
					self.driver.quit()
					return

		else: 

			# FRAME MAIN
			self.BUTTON.config(text="INICIAR PESQUISA")
			self.BUTTON["state"] = "normal"
			# FRAME BAR
			self.PROGRESS_BAR['value'] = 0
			self.TXT.set("Aguardando inicio de pesquisa ...")
			# POP UP			
			self.INTERFACE.change_frame(self.INTERFACE.frame_bar, self.INTERFACE.frame)
			self.INTERFACE.show_message("Ocorreu um erro de rede durante a pesquisa e não foi possível reinicia-la automaticamente, inicie a pesquisa manualmente !")
			# DRIVER
			self.driver.close()
			self.driver.quit()
			return

	def get_driver(self):
		""" Retorna a instância do 'driver', objeto responsável por navegar automaticamente o browser. """
		return self.driver

	def remove_duplicates(self, file_name):
		
		""" Remove entradas duplicadas do arquivo final xlsx. """
		file_df = pd.read_excel(file_name + ".xlsx", skiprows=1, index_col=0)

		# Mantem somente a primeira duplicata
		pd_first = file_df.drop_duplicates(subset=["PRODUTO", "ESTABELECIMENTO", "PRECO"], keep="first")
		size = pd_first['PRODUTO'].count()
		writer = pd.ExcelWriter(file_name + ".xlsx", engine='xlsxwriter')
		pd_first = pd_first.to_excel(writer, sheet_name = "Pesquisa",  index=False, startrow=0, startcol=1)

		workbook  = writer.book
		worksheet = writer.sheets['Pesquisa']
		formats = workbook.add_format({'border': 2})

		worksheet.set_column(1, size, None, formats)
		worksheet.set_column(1, 1, 35)
		worksheet.set_column(2, 2, 55)
		worksheet.set_column(3, 3, 23)
		worksheet.set_column(4, 4, 12)

		writer.save()

	def csv_to_xlsx(self,csvfile):
		
		""" Converte um arquivo csv em um arquivo xlsx. """
		workbook = Workbook(csvfile[:-4] + '.xlsx')
		worksheet = workbook.add_worksheet()
		formats = workbook.add_format({'border': 2})

		with open(csvfile, 'rt', encoding='latin-1') as f:
			reader = csv.reader(f)
			for r, row in enumerate(reader):
				for c, col in enumerate(row):
					
					if r == 3 and c == 3:
						
						worksheet.set_column(r+1, c+1, 15)
					
					else:

						worksheet.set_column(r+1, c+1, 33)
					
					worksheet.write(r+1, c+1, col, formats)
					
		workbook.close()

	def set_viewport_size(self, width, height):

		""" Muda o tamanho da janela do navegador. """
		window_size = self.driver.execute_script("""
			return [window.outerWidth - window.innerWidth + arguments[0],
			window.outerHeight - window.innerHeight + arguments[1]];
			""", width, height)
		self.driver.set_window_size(*window_size)

	def get_data(self, writer, product, keyword):
		""" 
			Filtra os dados da janela atual aberta do navegador e os salva no arquivo CSV.  

			Attributes:
				writer (file): Instância de um 'escritor' de arquivo.  
				product (string): Produto atual da pesquisa.  
				keyword (string): Palavra chave atual sendo pesquisa.

		"""
		local = self.LOCALS
		local_name = self.LOCALS_NAME
		found = True
		found_2 = True
		elements = []
		time.sleep(0.5)
  
		try:
			
			elements = self.driver.find_elements_by_class_name("flex-item2")

		except:
			
			self.captcha()
			
		elements = self.driver.find_elements_by_class_name("flex-item2")
		
		for element in elements:

			# * Processo de aquisição de dados

			try:
				
				# Nome do produto
				product_name = element.find_elements_by_tag_name("strong")[0]
				product_name = product_name.get_attribute('innerHTML')

				# Todas as tags com as informações do bloco do produto
				product_info = element.find_elements_by_tag_name("div")

			except:
				
				self.captcha()
				
				
			try:
				
				# Nome do produto
				product_name = element.find_elements_by_tag_name("strong")[0]
				product_name = product_name.get_attribute('innerHTML')

				# Todas as tags com as informações do bloco do produto
				product_info = element.find_elements_by_tag_name("div")
			
			except:
				
				self.captcha()
				
			# Preço do produto
			flag = 0
			if len(element.find_elements_by_class_name("sobre-desconto")) == 0:
				product_price = product_info[1].get_attribute('innerHTML')
			else:
				product_price = product_info[2].get_attribute('innerHTML')
				flag = 1
			
			pattern = re.compile(r"(?<=>)\s\w..\d?(\d).\d\d")
			product_size = len(product_price)
			product_price = product_price.replace('\n', '')
			product_price = product_price.replace(',', '.')

			if product_size > 15:
				
				if  pattern.search(product_price) != None:
					
					product_price = pattern.search(product_price).group(0)


			# Endereço do produto
			size = len(product_info)

			if size == 9:
				index = 3
			elif size == 10:
				if flag == 1:
					index = 4
				else:
					index = 3
			elif size == 11:
				index = 4
			else:
				index = 3
				

			pattern = re.compile(r"(?<=>).\w.*\w")
			product_adress = product_info[index].get_attribute('innerHTML')
			product_adress = pattern.search(product_adress).group()
			product_adress = product_adress[1:len(product_adress)]

			# print("Size: " + str(size))
			# print(local)
			# print(product_adress)
			

			if local[0] in str(product_adress):
				
				if self.filter_word(product, product_name):
						
					print('NORMAL ----------------------- ')
					print('Preço : ' + str(product_price))
					print('Local : ' + str(product_adress))
					print('Produto : ' + str(product_name))
					print('NORMAL ----------------------- ')
					found = False
					writer.writerow([str(product_name), str(
						product_adress), str(keyword), str(product_price)])
				
			if local[1] in str(product_adress):

				if self.filter_word(product, product_name):
					
					print('NORMAL ----------------------- ')
					print('Preço : ' + str(product_price))
					print('Local : ' + str(product_adress))
					print('Produto : ' + str(product_name))
					print('NORMAL ----------------------- ')
					found_2 = False
					writer.writerow([str(product_name), str(
						product_adress), str(keyword), str(product_price)])
				
			
			print('Todos ----------------------------')
			print('Preço : ' + str(product_price))
			print('Local : ' + str(product_adress))
			print('Produto : ' + str(product_name))
			print('Todos ----------------------------')
			with open(self.all_file, 'a+', newline='') as file:

				writer_2 = csv.writer(file, delimiter=',')
				writer_2.writerow([str(product_name), str(
				product_adress), str(keyword), str(product_price)])

			self.csv_to_xlsx(self.all_file)
				

		if found:
			
			writer.writerow([str(product), str(local_name[0]),
							str(keyword), "N/A"])
		
		if found_2:

			writer.writerow([str(product), str(local_name[1]),
							str(keyword), "N/A"])

	def check_captcha(self, request=0):
		
		""" Função que confere se o captcha foi resolvido com sucesso pelo usuário. """
		excpt = True
		# if request == 1:
			
		# 	self.driver.back()
		
		# time.sleep(1)
		try:

			WebDriverWait(self.driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "flash")))

		except:

			# print("Captcha desativado.")
			time.sleep(1)
			excpt = False
			return False

		finally:

			if excpt:
				
				# print("Captcha ativado.")
				
				return True
		
	def pop_up(self):
		""" Mostra uma mensagem em pop up para o usuário. """
		result = messagebox.showinfo("CAPTCHA", "Captcha foi ativado, abra o site do preço da hora e resolva-o em seu navegador e pressione OK para continuar", icon='warning')
		if result:
      
			self.driver.back()
		
		# if result == 'yes' and self.check_captcha(1):
		# 	return True
		# else:
		# 	return False

	def captcha(self):
		
		""" Trata por erro de rede e inicia um loop para conferir se o usuário resolveu o captcha. """
		# Se eu tenho conexão o captcha foi ativado, se não, é erro de rede.
		if self.connect():
			
			while True:
				# print("CAPTCHA")

				if self.check_captcha(1):
			
					# print("CAPTCHA TRUE")

					
					self.pop_up()

				else:

					# print("CAPTCHA FALSE")
					return 
		else:

			self.exit_thread(None, None, None, None, None)

	def backup_check(self, t_date, estab):
		""" Retorna os parâmetros de backup caso a pesquisa esteja sendo iniciada por um backup. """
		try:
		
			product = 0
			place = 0
			finish = 0
			keyword = 0
			date = 0
			estab_1 = 0
			estab_2 = 0
			
			with open('backup.json') as json_file:

				data = json.load(json_file)
				for backup in data['backup']:
					
					product = backup['prod']
					date = backup['date']    
					keyword = backup['keyword']
					finish = backup['done']
					estab_1 = backup['estab_1']
					estab_2 = backup['estab_2']
					
			if estab_1 != estab[0] and estab_2 != estab[1]:
				
				return(0,0)

			if t_date != date:
			
				return (0,0)
			
			# Pesquisa acabou
			if finish == -1:
				
				return (0,0)

			# Pesquisa do estabelecimento nao acabou
			if finish == 0:
				
				return (abs(product), abs(keyword))

			# Pesquisa do estebelcimento acabou
			if finish == 1:
				
				return (abs(product), abs(keyword))

		except:
			
			return(0,0)

	def backup_save(self,prod, date, keyword, done, estab, city, place):
		
		""" 
			Salva o estado atual da pesquisa em um arquivo JSON no local de execução da aplicação.  
			Attributes:
				prod (int): Índice do produto atual da pesquisa.  
				date (string): Data da pesquisa realizada.  
				keyword (int): Índice da palavra chave atual da pesquisa.  
				done (int):  Indica se a pesquisa terminou ou não.  
				estab (string): Array dos estabelecimentos sendo pesquisados.  
				place (string): Array dos nomes dos estabelecimentos sendo pesquisados.  
				city (string): Cidade que a pesquisa está sendo realizada.  
		"""
		
		data = {}
		data['backup'] = []
		data['backup'].append({"prod": prod, "date": date, "keyword" : keyword, "done": done, "estab_1": estab[0], "estab_2": estab[1], "city": city, 'place_1': place[0], 'place_2': place[1]})
		with open('backup.json', 'w+') as outfile:
		
			json.dump(data, outfile)

	def get_keywords(self):
		
		"""
		Retorna o array das palavras chaves em ordem.  
		"""

		keywords = []
		keywords.append(['ACUCAR CRISTAL', 'ACUCAR CRISTAL 1KG'])
		keywords.append(['ARROZ PARBOILIZADO', 'ARROZ PARBOILIZADO 1KG'])
		keywords.append(['BANANA DA PRATA', 'BANANA PRATA', 'BANANA KG'])
		keywords.append(['CAFE 250G', 'CAFE MOIDO'])
		keywords.append(['CHA DE DENTRO', 'COXAO MOLE', 'CARNE BOVINA CHA DE DENTRO'])
		keywords.append(['FARINHA DE MANDIOCA', 'FARINHA MAND', 'FARINHA MANDIOCA'])
		keywords.append(['FEIJAO CARIOCA'])
		keywords.append(['LEITE LIQUIDO'])
		keywords.append(['MANTEIGA 500G', 'MANTEIGA'])
		keywords.append(['OLEO DE SOJA', 'OLEO 900ML', 'OLEO'])
		keywords.append(['PAO FRANCES', 'PAO KG', 'PAO FRANCES KG'])
		keywords.append(['TOMATE KG'])
		
		return keywords

	def run(self):

		"""
		Realiza a pesquisa na plataforma do Preço da Hora Bahia.

		Attributes:
			csvfile (string): Caminho para o arquivo CSV.  
			all_file (string): Caminho para o arquivo CSV Todos.  
			driver (selenium.Driver): Instância do objeto responsável por realizar a automação do browser.  
			start_prod (int): Indíce de inicio do produto caso seja uma pesquisa por backup.  
			start_key (int): Indíce de inicio de palavra chave caso seja uma pesquisa por backup.  
		"""
		first  = 0
		URL = 'https://precodahora.ba.gov.br/'
		times = 4
		today = date.today()
		day = today.strftime("%d-%m-%Y")
		start_prod = 0
		start_key = 0
		restart = True
		csvfile = ''

		self.resource_path("logo.ico")
		chrome_options = Options()
		# DISABLES DEVTOOLS LISTENING ON 
		chrome_options.add_argument("--headless")
		chrome_options.add_argument("--no-sandbox")
		chrome_options.add_argument("--disable-dev-shm-usage")
		chrome_options.add_argument("--disable-gpu")
		chrome_options.add_argument("--disable-features=NetworkService")
		chrome_options.add_argument("--window-size=1920x1080")
		chrome_options.add_argument("--disable-features=VizDisplayCompositor")
		driver = webdriver.Chrome(	
			executable_path=ChromeDriverManager().install(), options=chrome_options)
		self.driver = driver
		self.set_viewport_size(800, 600)
		os.system('cls' if os.name=='nt' else 'clear')

		products =  ['ACUCAR CRISTAL',
					'ARROZ PARBOILIZADO',
					'BANANA PRATA',
					'CAFE MOIDO',
					'CHA DENTRO',
					'FARINHA MANDIOCA',
					'FEIJAO CARIOCA',
					'LEITE LIQUIDO',
					'MANTEIGA 500G',
					'OLEO SOJA',
					'PAO FRANCES',
					'TOMATE KG']

		product_name = ['ACUCAR CRISTAL',
					'ARROZ PARBOILIZADO',
					'BANANA DA PRATA',
					'CAFE MOIDO',
					'CHA DE DENTRO',
					'FARINHA DE MANDIOCA',
					'FEIJAO CARIOCA',
					'LEITE LIQUIDO',
					'MANTEIGA',
					'OLEO DE SOJA',
					'PAO FRANCES',
					'TOMATE']


		# Requer polimento do algoritmo para garantir a validade das informações
		# Teste da ferramenta Selenium com chromedriver
		
		keywords = self.get_keywords()
		products_backup = products
		
		if self.BACKUP:
			
			start_prod, start_key = self.backup_check(day, [self.LOCALS_NAME[0], self.LOCALS_NAME[1]])
			if start_prod > 0 or start_key > 0:
			
				self.TXT.set("Retomando pesquisa anterior ...")

		# Define endereço a ser visitado
		driver.get(URL)
		# * Processo de pesquisa de produto
		driver.find_element_by_id('fake-sbar').click()
		time.sleep(times)

		self.TXT.set("Pesquisa iniciada ...")
		
		if os.name == 'nt':

			toaster = ToastNotifier()
			toaster.show_toast("Pesquisa iniciada.",
						" ",
						icon_path=self.ico,
						duration = 10)
		
		self.TXT.set("Iniciando arquivos ...")
		# Cria a pasta de pesquisa
		dic = self.CITY + ' [ ' + day + ' ]'
		if not os.path.exists(dic):

			os.makedirs(dic)

		csvfile = dic + '/' + self.LOCALS_NAME[0] + ' ' + self.LOCALS_NAME[1] + '.csv' 
		all_file = dic + '/' + 'TODOS ' + self.LOCALS_NAME[0] + ' ' + self.LOCALS_NAME[1]  + '.csv'
		self.csvfile = csvfile		
		self.csvfile_name =  dic + '/' + self.LOCALS_NAME[0] + ' ' + self.LOCALS_NAME[1]		
		self.all_file = all_file		
		self.all_file_name = dic + '/' + 'TODOS ' + self.LOCALS_NAME[0] + ' ' + self.LOCALS_NAME[1]		

		# Se arquivo já existe, não preciso inicia-lo
		if start_prod != 0 or self.BACKUP:
			
			# print("restart")
			self.PROGRESS_BAR['value'] = (start_prod) * (100/len(products_backup))
			products = products[start_prod:]
			keywords = keywords[start_prod:]
			restart = False
			
		else: 
			
			products = products_backup
			# Inicia o arquivo csv com as colunas principais
			with open(csvfile, 'w+', newline='') as file:

				writer = csv.writer(file, delimiter=',')
				writer.writerow(
					["PRODUTO", "ESTABELECIMENTO", "KEYWORD", "PRECO"])

			with open(all_file, 'w+', newline='') as file:

				writer = csv.writer(file, delimiter=',')
				writer.writerow(
					["PRODUTO", "ESTABELECIMENTO", "KEYWORD", "PRECO"])
			
		self.PAUSE_BUTTON["state"] = "normal"

		for index, product in enumerate(products):

			if  not self.connect():

				self.exit_thread(None,None,None,None,None)
				return

			if self.stop:

				self.exit = True
				return
				
			keyword = keywords[index]
			if index == 0 and start_key > 0:
				
				keyword = keyword[start_key:]
			
			self.TXT.set("Pesquisando Produto : " +'[ ' + product_name[index + start_prod] + ' ]' )
			
			
			for key, word in enumerate(keyword):
				
				if not self.connect():

					self.exit_thread(None,None,None,None,None)
					return
 
				self.backup_save(index + start_prod, day, key + start_key, 0, [self.LOCALS_NAME[0], self.LOCALS_NAME[1]], self.CITY, [self.LOCALS[0], self.LOCALS[1]])

				if self.stop:

					self.exit = True
					return
				
				time.sleep(2*times)
				
				# Barra de pesquisa superior (produtos)
				try:

					WebDriverWait(driver, 3*times).until(
						EC.presence_of_element_located((By.CLASS_NAME, "sbar-input")))

				except:

					self.captcha()
					driver.get('https://precodahora.ba.gov.br/produtos')

				finally:

					search = driver.find_element_by_id('top-sbar')

				for w in word:

					search.send_keys(w)
					time.sleep(0.25)

				# Realiza a pesquisa (pressiona enter)
				search.send_keys(Keys.ENTER)

				time.sleep(3*times)
				driver.page_source.encode('utf-8')

				# * Processo para definir a região desejada para ser realizada a pesquisa

				if index == 0:
					
					# Botão que abre o modal referente a localização
					try:

						WebDriverWait(driver, 4*times).until(
							EC.presence_of_element_located((By.CLASS_NAME, "location-box")))

					except:

						self.captcha()
						time.sleep(1)
							
					finally:

						driver.find_element_by_class_name('location-box').click()
						time.sleep(2*times)

					# Botão que abre a opção de inserir o CEP
					try:

						WebDriverWait(driver, 2*times).until(
							EC.presence_of_element_located((By.ID, "add-center")))

					except:

						self.captcha()
						time.sleep(1)

					finally:

						driver.find_element_by_id('add-center').click()
						time.sleep(2*times)

					# Envia o MUNICIPIO desejado para o input

					driver.find_element_by_class_name('sbar-municipio').send_keys(self.CITY)
					time.sleep(1)

					# Pressiona o botão que realiza a pesquisa por MUNICIPIO
					driver.find_element_by_class_name('set-mun').click()
					
					time.sleep(1)
					driver.find_element_by_id('aplicar').click()

					time.sleep(2*times)
				
				if self.stop:

					self.exit = True
					return
				# Espera a página atualizar, ou seja, terminar a pesquisa. O proceso é reconhecido como terminado quando a classe flex-item2 está presente, que é a classe utilizada para estilizar os elementos listados
				try:

					WebDriverWait(driver, 4*times).until(
						EC.presence_of_element_located((By.CLASS_NAME, "flex-item2")))

				except:

					self.captcha()
					time.sleep(times)

				finally:

					flag = 0
					while True:

						if self.stop:

							self.exit = True
							return

						try:

							WebDriverWait(driver, 2*times).until(
								EC.presence_of_element_located((By.ID, "updateResults")))
							time.sleep(2*times)
							driver.find_element_by_id('updateResults').click()
							flag = flag + 1

							if flag == 3:

								break

						except:

							if not self.check_captcha(0):
								
								# print("Quantidade máxima de paginas abertas.")
								break
								
							else:
										
								self.captcha()

					if self.stop:

							self.exit = True
							return
					
					with open(csvfile, 'a+', newline='') as file:

						writer = csv.writer(file, delimiter=',')
						self.get_data(writer, product, word)
					
					self.csv_to_xlsx(csvfile)

			max_val = self.PROGRESS_BAR['value'] + (100/len(products_backup)) + 1
			for x in range(int(self.PROGRESS_BAR['value']), int(max_val)):
			
				self.PROGRESS_BAR['value'] = x
				time.sleep(0.01)
				
			if os.name == 'nt' and (index - len(products_backup))  == len(products_backup)/2:

				toaster = ToastNotifier()
				toaster.show_toast("Pesquisa na metade ...",
							" ",
							icon_path=self.ico,
							duration = 10)
		
		if self.stop:

			self.exit = True
			return

		time.sleep(1)
		for x in range(100,-1,-1):
			
			self.PROGRESS_BAR['value'] = x
			time.sleep(0.01)
		
		self.backup_save(0, day, 0, 1, [self.LOCALS_NAME[0], self.LOCALS_NAME[1]], self.CITY, [self.LOCALS[0], self.LOCALS[1]])
		start_prod = 0
			
		self.csv_to_xlsx(csvfile)
		self.remove_duplicates(self.csvfile_name)
		self.remove_duplicates(self.all_file_name)
		
		self.BUTTON.config(text="INICIAR PESQUISA")
		self.BUTTON["state"] = "normal"
		self.TXT.set("Aguardando inicio de pesquisa ...")
		self.INTERFACE.change_frame(self.INTERFACE.frame_bar, self.INTERFACE.frame)

		
		if os.name == 'nt':

			toaster = ToastNotifier()
			toaster.show_toast("Pesquisa encerrada.",
					" ",
					icon_path=self.ico,
					duration = 10)
			
		driver.close()
		driver.quit()