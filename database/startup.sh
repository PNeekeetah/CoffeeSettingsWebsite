# You will need to have postgres installed on the phone for this to work

mkdir -p $PREFIX/var/lib/postgresql
initdb $PREFIX/var/lib/postgresql

pg_ctl -D $PREFIX/var/lib/postgresql start

createuser --pwprompt user # this will be interactive - set it to password

createdb -O user database

psql -U user -d database -h localhost -f init.sql

# psql -U user -d database -h localhost -c "\dt" #  to test the connection and see the 2 tables