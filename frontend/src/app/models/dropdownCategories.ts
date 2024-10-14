export interface Option {
  name: string;  // The display name of the option
  path: string;  // The path associated with the option
}

export interface CategoryWithOptions {
  category: string; // Category name or ID
  options: Option[]; // Array of options for this category
}
