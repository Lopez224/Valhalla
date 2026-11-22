CREATE DATABASE IF NOT EXISTS fighters;
USE fighters;

CREATE TABLE IF NOT EXISTS fighter (
  `idFighters` INT AUTO_INCREMENT PRIMARY KEY,
  `Nombre Completo` VARCHAR(45) NULL,
  `Apodo` VARCHAR(45) NULL,
  `Nacionalidad` VARCHAR(45) NULL,
  `Estilo de combate` VARCHAR(45) NULL,
  `Base` VARCHAR(45) NULL,
  `Edad` INT NULL,
  `Altura` DECIMAL(3,2) NULL,
  `Alcance` DECIMAL(3,2) NULL,
  `PPV` DECIMAL(4,1) NULL,
  `Show Payment` INT NULL,
  `Promotora` VARCHAR(45) NULL,
  `Record` VARCHAR(45) NULL,
  `Foto` VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nam VARCHAR(100) NOT NULL,
  dat DATE NOT NULL,
  place VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS fights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  red_corner_id INT NOT NULL,
  blue_corner_id INT NOT NULL,
  orde INT,
  agreed_weight INT,
  contract_value INT,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (red_corner_id) REFERENCES fighter(`idFighters`),
  FOREIGN KEY (blue_corner_id) REFERENCES fighter(`idFighters`)
);

INSERT INTO fighter
  (`Nombre Completo`, `Apodo`, `Nacionalidad`, `Estilo de combate`, `Base`,
  `Edad`, `Altura`, `Alcance`, `PPV`, `Show Payment`, `Promotora`, `Record`)
VALUES
  ('Santos Saul Alvarez', 'El Canelo', 'Mexico', 'Striker', 'Boxeo',
  35, 1.71, 1.70, 77.9, 100000000, 'DAZN', '64-3-2');