import React, { useEffect, useState } from "react";
import { ThemesResponses } from "../../infrastructure/ApiResponse";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";

export function ThemesList({ repository }: { readonly repository: ApiThemeRepository }) {
    const [themes, setThemes] = useState<ThemesResponses[]>([]);

    useEffect(() => {
        repository.searchAll().then((data) => {
            setThemes(data);
        });
    }, []);

    // Group themes by group
    const groupedThemes = themes.reduce((acc, theme) => {
        const groupName = theme.group?.name || "Sin grupo";
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(theme);
        return acc;
    }, {} as Record<string, ThemesResponses[]>);

    // Split groups into two columns
    const groupEntries = Object.entries(groupedThemes);
    const mid = Math.ceil(groupEntries.length / 2);
    const columns = [groupEntries.slice(0, mid), groupEntries.slice(mid)];

    return (
        <>
            <h1>Themes List</h1>
            <div style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "2rem", background: "#f5f5f5", marginTop: "2rem" }}>
                <div style={{ display: "flex", gap: "2rem" }}>
                    {columns.map((column, colIdx) => (
                        <div key={column[0]?.[0] || `column-${colIdx}`} style={{ flex: 1, minWidth: 0 }}>
                            {column.map(([groupName, groupThemes]) => (
                                <GroupThemesList key={groupName} groupName={groupName} groupThemes={groupThemes} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function CategoryThemesList({ categoryName, themes }: { readonly categoryName: string; readonly themes: readonly ThemesResponses[] }) {
    return (
        <div key={categoryName} style={{ marginTop: "1rem" }}>
            <span style={{ color: "gray", fontSize: "1rem" }}>{categoryName}</span>
            <ul>
                {themes.map((theme) => (
                    <li key={theme.id}>{theme.name}</li>
                ))}
            </ul>
        </div>
    );
}

function GroupThemesList({ groupName, groupThemes }: { readonly groupName: string; readonly groupThemes: readonly ThemesResponses[] }) {
    const noCategory = groupThemes.filter(t => !t.category);
    const withCategory = groupThemes.filter(t => t.category);
    const categories = Array.from(new Set(withCategory.map(t => t.category?.name)));

    return (
        <div key={groupName} style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginTop: 0 }}>{groupName}</h2>
            {/* Themes without category */}
            {noCategory.length > 0 && (
                <ul>
                    {noCategory.map((theme) => (
                        <li key={theme.id}>{theme.name}</li>
                    ))}
                </ul>
            )}
            {/* Themes grouped by category */}
            {categories.map((catName) => (
                <CategoryThemesList
                    key={catName}
                    categoryName={catName}
                    themes={withCategory.filter(t => t.category?.name === catName)}
                />
            ))}
        </div>
    );
}