import Knex from "knex";

export async function seed(knex: Knex){
    await knex('items').insert([
        { title: 'Lâmpadas', image: 'lampada.svg' },
        { title: 'Pilhas e Baterias', image: 'lampada.svg' },
        { title: 'Papéis e Papelão', image: 'lampada.svg' },
        { title: 'Resíduos Eletrônicos', image: 'lampada.svg' },
        { title: 'Resíduos Orgânicos', image: 'lampada.svg' },
        { title: 'Óleo de Cozinha', image: 'lampada.svg' },
    ])
}