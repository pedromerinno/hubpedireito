-- Pé Direito · adiciona valor 'casamento' ao enum lead_tipo
-- 6ª porta: noivos/cerimonialistas que querem distribuir Pé Direito como
-- kit de padrinhos OU como chinelo pós-festa (escolha do solicitante).
alter type lead_tipo add value if not exists 'casamento';
