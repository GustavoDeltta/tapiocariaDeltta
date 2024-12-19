create table fillings (
	id integer,
	id_food integer,
	name varchar,
	price real,
	primary key (id, id_food),
	foreign key (id_food) references foods (id)
) 

create table sales (
	id serial primary key,
	id_food integer,
	cpf varchar,
	sale_date date,
	description varchar(100),
	price real,
	foreign key (id_food) references foods (id)
)

create table foods (
	id integer primary key,
	name varchar,
	price real
)