<?php

namespace App\Http\Controllers;

use App\Models\Operator;
use Illuminate\Http\Request;

class OperatorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $operators = Operator::all();
        return inertia('operator/operators', [
            'operators' => $operators,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_operator' => 'required|string|max:255',
        ]);

        $validated['nama_operator'] = strtoupper($validated['nama_operator']);

        Operator::create($validated);
        return redirect()->back()->with('success', 'Operator added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Operator $operator)
    {
        return inertia('operator/show', [
            'operator' => $operator,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Operator $operator)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $operator = Operator::findOrFail($id);
        $validated = $request->validate([
            'nama_operator' => 'required|string|max:255',
        ]);

        $validated['nama_operator'] = strtoupper($validated['nama_operator']);

        $operator->update($validated);
        return redirect()->back()->with('success', 'Operator updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $operator = Operator::findOrFail($id);
        $operator->delete();
        return redirect()->back()->with('success', 'Operator deleted successfully!');
    }
}
