
file = "file1.txt"
f=open(file,"r")
lines = f.readlines()
f.close
for line in lines:
	print(line.strip())