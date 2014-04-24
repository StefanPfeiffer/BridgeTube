import csv, math, sys

infile = sys.argv[1]
outfile = sys.argv[2]

MPS_PKTTYPE_STATINFO = 10
MPS_PKTTYPE_ACC = 11
MPS_PKTTYPE_DMS = 12

MAXADDRESS = 16

offsets = [0] * MAXADDRESS
dms_offsets = [0] * MAXADDRESS

def vector_magnitude(x, y, z):
    xp = math.pow(x, 2)
    yp = math.pow(y, 2)
    zp = math.pow(z, 2)

    return math.sqrt(xp + yp + zp)

def reformat():

    add = 0.01
    old_ts = -1

    with open(infile, 'rb') as fin, open(outfile, 'wb') as fou:
        csv_reader = csv.reader(fin, delimiter=',')
        csv_writer = csv.writer(fou)

        csv_writer.writerow(['timestamp'
                            , 'Node 4'
                            , 'Node 5'
                            , 'Node 6'
                            , 'Node 7'
                            ])

        for row in csv_reader:
            if len(row) == 7:
                _type = MPS_PKTTYPE_ACC
                _id = int(row[1])
                timestamp = float(row[3])
                x = int(row[4])
                y = int(row[5])
                z = int(row[6])
            # elif len(row) == 6:
            #     _type = MPS_PKTTYPE_DMS
            #     _id = int(row[1])
            #     timestamp = int(row[3])
            #     hb1 = int(row[4])
            #     hb2 = int(row[5])
            else:
                # Probably corrupt packet; ignore this for now
                continue

            if _type == MPS_PKTTYPE_ACC:
                if offsets[_id] == 0:
                    offsets[_id] = timestamp

                val = vector_magnitude(x, y, z) / 1000
                ts = (timestamp - offsets[_id]) * 0.00001

                if (old_ts < 0):
                   old_ts = ts
                if ts == old_ts:
                   ts += add
                   add += 0.01
                else:
                   old_ts = ts
                   add = 0.01

                csv_writer.writerow([ts] + ([''] * (_id - 4)) + [val]
                      + ([''] * (7 - _id)))

            # elif _type == MPS_PKTTYPE_DMS:
            #     if dms_offsets[_id] == 0:
            #         dms_offsets[_id] = timestamp

            #     val = hb1
            #     ts = (timestamp - dms_offsets[_id]) * 0.00001

            #     csv_writer.writerow([ts] + ([''] * 2 * (_id - 4)) + ['']
            #             + [val] + ([''] * 2 * (8 - _id)))

if __name__ == '__main__':
   reformat()
