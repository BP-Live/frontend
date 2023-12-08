import requests 
import tarfile
url = 'https://bvkmomehackathon.blob.core.windows.net/data/data.tar.gz?sv=2023-01-03&st=2023-12-08T13%3A00%3A00Z&se=2023-12-09T22%3A59%3A00Z&sr=b&sp=r&sig=r9vZbX7l3EiQD%2B6niCGmdaGwTiPais2QuU6lO2exiZU%3D'
with requests.get(url, stream=True) as rx, tarfile.open(fileobj=rx.raw, mode="r:gz")  as tarobj : tarobj.extractall() 