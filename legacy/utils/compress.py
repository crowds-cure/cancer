experiment = """
Tested with various compression options and found that
the jpeg extended option with quality of 50% gave about
a 10x compression with no noticable artifacts.
http://support.dcmtk.org/docs/dcmcjpeg.html
$ ls -l
total 2376
-rw-------@ 1 pieper  wheel  528106 Nov 20 12:33 000000.dcm
-rw-r--r--  1 pieper  wheel  210460 Nov 20 12:36 000000.dcm+e1
-rw-r--r--  1 pieper  wheel   23394 Nov 20 12:36 000000.dcm+eb
-rw-r--r--  1 pieper  wheel   99538 Nov 20 12:37 000000.dcm+ee
-rw-r--r--  1 pieper  wheel   42540 Nov 20 15:01 000000.dcm+ee+q50
-rw-r--r--  1 pieper  wheel   93318 Nov 20 12:38 000000.dcm+ep
-rw-r--r--  1 pieper  wheel   18328 Nov 20 12:40 000000.dcm+ep+q10
-rw-r--r--  1 pieper  wheel   42536 Nov 20 12:41 000000.dcm+ep+q50
-rw-r--r--  1 pieper  wheel   97222 Nov 20 12:37 000000.dcm+es
-rw-r--r--  1 pieper  wheel   42052 Nov 20 15:01 000000.dcm+es+q50
To re-run the compression, install dcmtk in the system path
and pip install couchdb and run the following script pointing
at appropriate databases.
"""


import subprocess
import couchdb

url = 'http://rsnacrowdquant.cloudapp.net:5984'
url2 = 'http://rsnacrowdquant2.eastus2.cloudapp.azure.com:5984'

server = couchdb.Server(url2)

source = server['chronicle_bak2']
target = server['compressed-chronicle2']

soFar = 0
for document in source:
    soFar += 1
    print(document)
    print('Document %d of %d' % (soFar, len(source)))
    fp = source.get_attachment(document, 'object.dcm')


    if fp:
        fpout = open('/tmp/object-orig.dcm', 'wb')


        fpout.write(fp.read())
        fp.close()
        fpout.close()
        print('converting...')
        returnCode = subprocess.call(['dcmcjpeg', '+ee', '+q', '50', '/tmp/object-orig.dcm', '/tmp/object.dcm'])
        toUpload = '/tmp/object.dcm'
        if returnCode != 0:
            print('Error converting!')
            toUpload = '/tmp/object-orig.dcm'
        fpUp = open(toUpload, 'rb')
        target.put_attachment(target[document], fpUp, 'object.dcm')
        print('Uploaded')
    else:
        print('no dicom object')
