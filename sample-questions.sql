-- Sample SAT Reading & Writing Questions
-- Insert this after running the main schema

-- Sample questions for Craft & Structure - Words in Context (Easy)
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Words in Context'),
  'Easy',
  'As used in line 15, "elaborate" most nearly means',
  '["complex", "decorate", "explain in detail", "create"]',
  2,
  'In this context, "elaborate" refers to explaining something in detail, not making it complex or decorative.',
  'The author goes on to elaborate on the historical significance of this discovery, providing numerous examples and detailed analysis.'
),
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Words in Context'),
  'Easy',
  'The word "novel" in line 8 most nearly means',
  '["book", "new", "interesting", "fictional"]',
  1,
  'Here "novel" means new or innovative, not referring to a book or fictional story.',
  'The researchers developed a novel approach to solving this longstanding problem.'
);

-- Sample questions for Craft & Structure - Words in Context (Medium)
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Words in Context'),
  'Medium',
  'As used in line 23, "articulate" most nearly means',
  '["speak clearly", "express clearly", "connect", "separate"]',
  1,
  'In this context, "articulate" means to express clearly, not just to speak clearly.',
  'The scientist struggled to articulate the complex relationship between these two variables.'
),
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Words in Context'),
  'Medium',
  'The word "profound" in line 12 most nearly means',
  '["deep", "loud", "important", "difficult"]',
  0,
  'Here "profound" means deep in the sense of having great depth or significance.',
  'The discovery had a profound impact on our understanding of human evolution.'
);

-- Sample questions for Craft & Structure - Words in Context (Hard)
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Words in Context'),
  'Hard',
  'As used in line 31, "ubiquitous" most nearly means',
  '["everywhere", "powerful", "common", "important"]',
  0,
  'Ubiquitous means present everywhere or in all places.',
  'Smartphones have become ubiquitous in modern society, appearing in nearly every aspect of daily life.'
);

-- Sample questions for Information & Ideas - Central Ideas & Details
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Information & Ideas'),
  (SELECT id FROM subunits WHERE name = 'Central Ideas & Details'),
  'Easy',
  'The main purpose of the passage is to',
  '["describe a scientific discovery", "argue for environmental protection", "explain a historical event", "compare two theories"]',
  0,
  'The passage primarily describes a scientific discovery and its implications.',
  'In 2020, researchers discovered a new species of deep-sea coral that exhibits remarkable bioluminescent properties. This discovery has significant implications for our understanding of marine ecosystems and could lead to new medical applications.'
),
(
  (SELECT id FROM domains WHERE name = 'Information & Ideas'),
  (SELECT id FROM subunits WHERE name = 'Central Ideas & Details'),
  'Medium',
  'According to the passage, which of the following best describes the relationship between technology and education?',
  '["Technology has completely replaced traditional teaching methods", "Technology enhances but does not replace effective teaching", "Technology has had no significant impact on education", "Technology has made education more expensive"]',
  1,
  'The passage suggests that technology enhances education but works best when combined with effective teaching methods.',
  'While technology has transformed many aspects of education, research shows that the most effective learning environments combine digital tools with skilled teaching. Technology alone cannot replace the human element of education.'
);

-- Sample questions for Standard English Conventions - Boundaries
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Standard English Conventions'),
  (SELECT id FROM subunits WHERE name = 'Boundaries'),
  'Easy',
  'Which choice completes the text with the most logical and precise word or phrase?',
  '["The experiment was successful, the results were published in a prestigious journal.", "The experiment was successful; the results were published in a prestigious journal.", "The experiment was successful the results were published in a prestigious journal.", "The experiment was successful, and the results were published in a prestigious journal."]',
  3,
  'The correct answer uses a comma and coordinating conjunction to properly join two independent clauses.',
  'The experiment was successful, and the results were published in a prestigious journal.'
),
(
  (SELECT id FROM domains WHERE name = 'Standard English Conventions'),
  (SELECT id FROM subunits WHERE name = 'Boundaries'),
  'Medium',
  'Which choice completes the text with the most logical and precise word or phrase?',
  '["The researchers conducted extensive fieldwork; they collected data from over 50 sites.", "The researchers conducted extensive fieldwork, they collected data from over 50 sites.", "The researchers conducted extensive fieldwork they collected data from over 50 sites.", "The researchers conducted extensive fieldwork and they collected data from over 50 sites."]',
  0,
  'A semicolon is the correct punctuation to join two closely related independent clauses.',
  'The researchers conducted extensive fieldwork; they collected data from over 50 sites.'
);

-- Sample questions for Expression of Ideas - Transitions
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Expression of Ideas'),
  (SELECT id FROM subunits WHERE name = 'Transitions'),
  'Easy',
  'Which choice completes the text with the most logical and precise word or phrase?',
  '["However", "Therefore", "Meanwhile", "Additionally"]',
  0,
  'However is the appropriate transition to show contrast between the two ideas.',
  'The initial hypothesis seemed promising. However, the experimental results did not support the theory.'
),
(
  (SELECT id FROM domains WHERE name = 'Expression of Ideas'),
  (SELECT id FROM subunits WHERE name = 'Transitions'),
  'Medium',
  'Which choice completes the text with the most logical and precise word or phrase?',
  '["Furthermore", "Nevertheless", "Consequently", "Similarly"]',
  2,
  'Consequently shows the cause-and-effect relationship between the discovery and its impact.',
  'The discovery of this new species was unexpected. Consequently, it has led to a complete revision of our understanding of the ecosystem.'
);

-- Sample questions for Expression of Ideas - Rhetorical Synthesis
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Expression of Ideas'),
  (SELECT id FROM subunits WHERE name = 'Rhetorical Synthesis'),
  'Hard',
  'The student wants to emphasize the practical applications of the research. Which choice most effectively uses relevant information from the graph to accomplish this goal?',
  '["The research shows that 75% of participants reported improved outcomes, demonstrating its practical value.", "The study included 200 participants, making it statistically significant.", "The research was conducted over a three-year period, ensuring reliability.", "The findings were published in a peer-reviewed journal, indicating quality."]',
  0,
  'This choice directly connects the research results to practical applications by highlighting the improvement in outcomes.',
  'A recent study examined the effectiveness of a new educational intervention. The graph shows that 75% of participants reported improved learning outcomes after six months of implementation.'
);

-- Add more questions for each subunit to ensure adequate coverage
-- Craft & Structure - Text Structure & Purpose
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Text Structure & Purpose'),
  'Medium',
  'The author''s use of a chronological structure primarily serves to',
  '["emphasize the complexity of the process", "show the evolution of ideas over time", "create suspense about the outcome", "compare different approaches"]',
  1,
  'A chronological structure helps readers understand how ideas or processes developed over time.',
  'The development of this technology began in the 1980s with basic research into materials science. By the 1990s, researchers had identified key properties that made the technology viable. In the 2000s, practical applications began to emerge, leading to today''s widespread adoption.'
);

-- Information & Ideas - Command of Evidence: Textual
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Information & Ideas'),
  (SELECT id FROM subunits WHERE name = 'Command of Evidence: Textual'),
  'Medium',
  'Which choice provides the best evidence for the answer to the previous question?',
  '["The study included participants from diverse backgrounds", "Researchers found that 80% of participants showed improvement", "The intervention was designed by educational experts", "Data was collected over a six-month period"]',
  1,
  'This provides specific evidence (80% improvement) that supports the claim about the intervention''s effectiveness.',
  'The educational intervention was highly effective. Researchers found that 80% of participants showed improvement in their test scores after just three months of implementation.'
);

-- Information & Ideas - Command of Evidence: Quantitative
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Information & Ideas'),
  (SELECT id FROM subunits WHERE name = 'Command of Evidence: Quantitative'),
  'Hard',
  'According to the graph, which statement is best supported by the data?',
  '["The majority of students prefer online learning", "Test scores increased by an average of 15 points", "Enrollment has doubled since 2020", "The program is more effective for older students"]',
  1,
  'The graph shows a clear increase in test scores, with the average improvement being 15 points.',
  'The data shows a clear trend in student performance. Test scores increased by an average of 15 points after implementing the new curriculum.'
);

-- Information & Ideas - Inferences
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Information & Ideas'),
  (SELECT id FROM subunits WHERE name = 'Inferences'),
  'Medium',
  'Based on the passage, it can most reasonably be inferred that',
  '["the researchers were surprised by their findings", "the study was conducted in multiple countries", "the results were immediately accepted by the scientific community", "the research team included experts from various fields"]',
  0,
  'The passage mentions that the discovery was "unexpected," which supports the inference that researchers were surprised.',
  'The unexpected discovery of this new species has challenged many long-held assumptions about biodiversity in this region.'
);

-- Craft & Structure - Cross-Text Connections
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Craft & Structure'),
  (SELECT id FROM subunits WHERE name = 'Cross-Text Connections'),
  'Hard',
  'The author of Passage 2 would most likely respond to the claim in Passage 1 by',
  '["agreeing with the methodology but questioning the conclusions", "disputing the validity of the research design", "suggesting alternative interpretations of the data", "proposing additional research to confirm the findings"]',
  2,
  'Based on the different perspectives presented in the two passages, the author of Passage 2 would likely suggest alternative interpretations.',
  'Passage 1: The study demonstrates clear evidence of climate change impacts on marine ecosystems.\n\nPassage 2: While the data shows changes in marine environments, these variations may be part of natural cycles rather than human-caused climate change.'
);

-- Standard English Conventions - Form, Structure, and Sense
INSERT INTO questions (domain_id, subunit_id, difficulty, question_text, choices, answer, explanation, passage_text) VALUES
(
  (SELECT id FROM domains WHERE name = 'Standard English Conventions'),
  (SELECT id FROM subunits WHERE name = 'Form, Structure, and Sense'),
  'Medium',
  'Which choice completes the text so that it conforms to the conventions of Standard English?',
  '["The team of researchers were", "The team of researchers was", "The team of researchers have been", "The team of researchers had been"]',
  1,
  'The subject "team" is singular, so it requires the singular verb "was."',
  'The team of researchers was responsible for conducting the study.'
); 