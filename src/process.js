import {Command} from 'commander';


const program = new Command();


program
    .option('--test', 'Variable para correr los test', false)
    .option('-p <port>', 'Puerto del servidor', 9090)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

export default program;