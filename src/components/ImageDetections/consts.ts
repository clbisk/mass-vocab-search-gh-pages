const punctuation: RegExp = /[.,/#!$%^&*;:{}=\-_`~()]/g;

/** Google Cloud Natural Language API enums */
enum Tag {
	UNKNOWN = "",
	ADJ = "Adjective",
	ADP = "Preposition",
	ADV = "Adverb",
	CONJ = "Conjunction",
	DET = "Determiner",
	NOUN = "Noun",
	NUM = "Number",
	PRON = "Pronoun",
	PRT = "Particle",
	PUNCT = "Punctuation",
	VERB = "Verb",
	X = "",
	AFFIX = "Affix",
}

enum Aspect {
	ASPECT_UNKNOWN = "",
	PERFECTIVE = "Perfective",
	IMPERFECTIVE = "Imperfective",
	PROGRESSIVE = "Progressive",
}

enum Form {
	FORM_UNKNOWN = "",
	ADNOMIAL = "Adnomial",
	AUXILIARY = "Auxiliary",
	COMPLEMENTIZER = "Complementizer",
	FINAL_ENDING = "Final ending",
	GERUND = "Gerund",
	REALIS = "Realis",
	IRREALIS = "Irrealis",
	SHORT = "Short form",
	LONG = "Long form",
	ORDER = "Order form",
	SPECIFIC = "Specific form"
}

enum Case {
	CASE_UNKNOWN = "",
	ACCUSATIVE = "Accusative",
	ADVERBIAL = "Adverbial",
	COMPLEMENTIVE = "Complementive",
	DATIVE = "Dative",
	GENITIVE = "Genitive",
	INSTRUMENTAL = "Instrumental",
	LOCATIVE = "Locative",
	NOMINATIVE = "Nominative",
	OBLIQUE = "Oblique",
	PARTITIVE = "Partitive",
	PREPOSITIONAL = "Prepositional",
	REFLEXIVE_CASE = "Reflexive",
	RELATIVE_CASE = "Relative",
	VOCATIVE = "Vocative"
}

enum Gender {
	GENDER_UNKNOWN = "",
	FEMININE = "Feminine",
	MASCULINE = "Masculine",
	NEUTER = "Neuter"
}

enum Mood {
	MOOD_UNKNOWN = "",
	CONDITIONAL_MOOD = "Conditional",
	IMPERATIVE = "Imperative",
	INDICATIVE = "Indicative",
	INTERROGATIVE = "Interrogative",
	JUSSIVE = "Jussive",
	SUBJUNCTIVE = "Subjunctive",
}

enum Number {
	NUMBER_UNKNOWN = "",
	SINGULAR = "Singular",
	PLURAL = "Plural",
	DUAL = "Dual"
}

enum Person {
	PERSON_UNKNOWN = "",
	FIRST = "First",
	SECOND = "Second",
	THIRD = "Third",
	REFLEXIVE_PERSON = "Reflexive",
}

enum Proper {
	PROPER_UNKNOWN = "",
	PROPER = "Proper",
	NOT_Proper = "Not Proper"
}

enum Reciprocity {
	RECIPROCITY_UNKNOWN = "",
	RECIPROCAL = "Reciprocal",
	NON_RECIPROCAL = "Non-reciprocal",
}

enum Tense {
	TENSE_UNKNOWN = "",
	CONDITIONAL_TENSE = "Conditional",
	FUTURE = "Future",
	PAST = "Past",
	PRESENT = "Present",
	IMPERFECT = "Imperfect",
	PLUPERFECT = "Pluperfect",
}

enum Voice {
	VOICE_UNKNOWN = "",
	ACTIVE = "Active",
	CAUSATIVE = "Causative",
	PASSIVE = "Passive",
}

export { punctuation, Tag, Form, Aspect, Case, Gender, Mood, Number, Person, Proper, Reciprocity, Tense, Voice }