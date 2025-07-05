<?php

namespace App\Http\Controllers;

use App\Models\OperatorFinishing;
use Illuminate\Http\Request;

class OperatorFinishingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $operatorFinishings = OperatorFinishing::all();
        return inertia('operatorFinishing/operatorFinishings', [
            'operatorFinishings' => $operatorFinishings,
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
            'nama_operator_finishing' => 'required|string|max:255',
        ]);

        $validated['nama_operator_finishing'] = strtoupper($validated['nama_operator_finishing']);

        OperatorFinishing::create($validated);
        return redirect()->back()->with('success', 'Operator Finishing added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(OperatorFinishing $operatorFinishing)
    {
        return inertia('operatorFinishing/show', [
            'operatorFinishing' => $operatorFinishing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OperatorFinishing $operatorFinishing)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $operatorFinishing = OperatorFinishing::findOrFail($id);
        $validated = $request->validate([
            'nama_operator_finishing' => 'required|string|max:255',
        ]);
        $operatorFinishing->update($validated);
        return redirect()->back()->with('success', 'Operator Finishing updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $operatorFinishing = OperatorFinishing::findOrFail($id);
        $operatorFinishing->delete();
        return redirect()->back()->with('success', 'Operator Finishing deleted successfully!');
    }
}
